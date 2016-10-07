
$(document).ready(initializePage);
$(document).on("page:load", initializePage);

  /***** Sequence Selection *****/
  var seqInput = new SequenceInput($('#sequence-display')[0]);

  var seqAlert = new SequenceAlert($('#sequence_alert'), $('#sequence_alert'));
  var submit1 = $('#submit1');
  var searchAccession = new Button($('#submit_ACN'));
  var accessionAlert = new AccessionAlert($('#accession_alert'));
  var request = new Request();
  var fileLoader = new FileLoader();

  /* Step 3 */
  var submissionAlert = new SequenceAlert($('#submitAlert'), $('#submitAlert2'));
  var userInfoAlert = new SequenceAlert($('#organization-alert'), $('#organization-alert'));

  /* Step 4 */
  var progressBar = new ProgressBar($(".bar"), $("#timeLeft"), request);
  var stateReporter = new StateReporter($(".resultsButton").next());
  var resultsPanel = new ResultsPanel($(".resultsButton"));
  var submit4 = new Button($("#submit4"));
  var processingAlert = new SequenceAlert($("#processingAlert"), $("#processingAlert"));

  var emailReporter = new EmailReporter($("#input-email"), $("#confirmation-email"), $("#emailAlert"));

    /**** Design Option ******/
  var summary = new SummaryTable();
  var designAlert = new SequenceAlert($('#designAlert'), $('#designAlert2'));
  var validator = new DesignParamsValidator(designAlert);
function initializePage() {

  $("#rz-select").change(function() {
      var selection = $('#rz-select option:selected').attr('value');
      if(selection != ''){
        window.location.href = '/ribozyme?selection=' + selection;
      }

  });

  function fetchInputAccessionNumber(){
    var validator = new AccNumberValidator($('#accession').val());
    if(!validator.getAccessionNumber()){
      return;
    }
    //accessionAlert.setState("Searching");
    submit1.addClass('disabled');
  //  seqAlert.hide();
    validator.validate(function(result){
      var input = result.toString();
      var validation = InputValidation.isInputValid(input);
      request.sequence = InputValidation.cleanInput(input);
      seqInput.setText(request.sequence);
      seqAlert.setState(validation);
      if(validation.ok){
        submit1.removeClass('disabled');
      }
      accessionAlert.setState("Success");
      window.setTimeout(function(){
        accessionAlert.hide();
        seqAlert.hide();
      }, 3000);
      request.accessionNumber = validator.getValidAccessionNumber();
    },
    function(error){
      accessionAlert.setState("Failure");
      request.accessionNumber = validator.getValidAccessionNumber();
    })
  };
  console.log("document loaded!!");

  if($(".progress").length > 0) {
    updatePage();
    submit4.click(finishStep4);
    $("#emailSubmit").click(function(){
      emailReporter.submit($("#emailInput").val());
    });
  }

  searchAccession.click(fetchInputAccessionNumber);
  seqInput.emptyText();
  $('#submit1').click(function(){
    console.log(request);
    request.sequence = InputValidation.cleanInput($('#sequence-display').val());
    request.sequence = request.sequence.toUpperCase();
    request.OriginalSequence = request.sequence;
    console.log(request.sequence);
    if(window.location.href.indexOf("crispr") != -1){
      request.ribozymeSelection = "crispr";
    }
    if(request.ribozymeSelection != "crispr"){
      var selection = getUrlVars().selection;
      console.log(selection);
      request.ribozymeSelection = selection;
      $('#rz-cutsites').empty();
      var index = 0;
      $("input[ribozyme='" + selection + "']").each(function() {
        var selected = "";
        if(index == 0) selected = "selected=\"selected\"";
        $('#rz-cutsites').append("<option " + selected + " value=" + $(this).attr("cutsite") + ">" + $(this).attr("cutsite") + "</option>");
        index++;
      }, this);

      $('div[name="ribozymeHelixSizes"]').hide();
      $('#' + selection).show();
    }
    if($('#accession').val() == '') {
      $('#target-region').hide();
    } else {
      $('#target-region').show();
    }
  });

  $('#sequence-display').on('keyup change mouseout', function(){
    if(!seqInput.isEmptyText()){
      submit1.removeClass('disabled');
    } else {
      submit1.addClass('disabled');
    }
  });


  $('#stepTwoFinish').click(function(event){
    var data = $("#msform").serializeArray().filter( function( item ) {
      return (item.name != 'left_arm_min' && item.name != 'left_arm_max'
        && item.name != 'right_arm_min' && item.name != 'right_arm_max');
    });
    var visibleHelixSize = $("div[name='ribozymeHelixSizes'][style!='display: none;'] :input").serializeArray();

    var objMap = new Object();
    $.map(visibleHelixSize, function(obj,i){
      return objMap[obj.name] = obj.value;
    });

    if(!('left_arm_min' in objMap)) visibleHelixSize.push({name: 'left_arm_min', value: -1});
    if(!('left_arm_max' in objMap)) visibleHelixSize.push({name: 'left_arm_max', value: -1});
    if(!('right_arm_min' in objMap)) visibleHelixSize.push({name: 'right_arm_min', value: -1});
    if(!('right_arm_max' in objMap)) visibleHelixSize.push({name: 'right_arm_max', value: -1});

    $.merge(data, visibleHelixSize);

    request.extractData(data);
    console.log(request);
    console.log(data);
    var regionCount = request.region !== undefined ? request.region.length : 0;

    if(regionCount === 0 && request.accessionNumber !== undefined){
      designAlert.setState({ok:false, error:"At least one region must be selected for the sequence (e.q. ORF)"});
      return;
    }

    $('#stepTwoFinish').addClass('disabled');
    if(validator.validate(request)){
      designAlert.hide();
      designAlert.setState({ok:true, error:"Searching for UTR..."});
      summary.setTableData(request);
      $("body").css("cursor","wait");
      $("#stepTwoFinish").css("cursor","wait");

      request.sequence = request.OriginalSequence;
      if(!request.accessionNumber || regionCount == 3){
        designAlert.hide();
        $('#stepTwoFinish').removeClass('disabled');
        $("body").css("cursor","");
        $("#stepTwoFinish").css("cursor","");
      }
      else
      {
        FindUTRBoundaries( 
          function findingDone(e) 
           {
             if (e == 1)
             {
                designAlert.hide();
                $('#stepTwoFinish').removeClass('disabled');
                $("body").css("cursor","");
                $("#stepTwoFinish").css("cursor","");
                var param = new Object();
                param.data = $('#stepTwoFinish');
                param.boundaryChecked = true;
                Progress.stepNext(param);
             }
             else if(e == 0)
             {
                designAlert.setState({ok:false, error:"NCBI is not responding or is temporarily down." +
                                                "Please try again in a minute or select the whole gene. "+
                                                "(Multiple searches in a small window of time may "+
                                                "cause this)"});
             }
             else 
             {
                designAlert.setState({ok:false, error:"The region of the RNA you have selected is more than 2000 nucleotides." +
                                                "To permit fair use of the software among users, the sequence must be less than 2000 nucleotides. "+
                                                "Please select a smaller region or manually trim the sequence in the first step to respect this condition." });
             
             }
             $("body").removeAttr("style");
             designAlert.hide();
           }
         );
      }
    }

  });

  if($("#results").length > 0) {
      $("#results").dataTable();
      $("thead tr th:nth-child(2) p").tooltip({title:"5'-3' Sequence of the generated ribozyme"});
      $("thead tr th:nth-child(3) p").tooltip({title:'Hybridization temperature of the ribozymes left arm'});
      $("thead tr th:nth-child(4) p").tooltip({title:'Hybridization temperature of the ribozymes right arm'});
      $("thead tr th:nth-child(5) p").tooltip({title:'Measure of target accessibility based on the RNA folding on itself. 1 is the best value, 0 is the worst.'});
      $("thead tr th:nth-child(6) p").tooltip({title:'Second measure of accessibility based on the thermodynamical favourability of the RNA switching to an open configuration. A greater value is better. Values will range between 0 and 1.' +
        'This value is on a cutsite-basis.'});
      $("thead tr th:nth-child(7) p").tooltip({title:'Measure of how good the shape is based on annealing pairs that are not in the catalytic core. A greater value is better. Values will range between 0 and 1.'});
      $("thead tr th:nth-child(8) p").tooltip({title:'Number of off-target hits, weighted by how good the match is and whether it is just hybridizing or fully cleaving. '
                                        +'XN-type genes are not counted to this value, but are reported on the list. Click on the number for details. Lowest is better.'});
      $("thead tr th:nth-child(9) p").tooltip({title:'Overall Rank based on the quality of each attribute independently, e.g. a candidate with highest accessibility will be rank 1 regardless of everything else.'});
  }


  $('#stepThreeFinish').click(function(){
    userInfoAlert.hide();
    submissionAlert.hide();
    request.organization = $('#organization').val();
    request.emailUser = $('#email').val();
    console.log(request);
    console.log(window.location);
    if(!request.organization && !request.emailUser){
      userInfoAlert.setState({ok: false, error: "You must enter the name of your organization and your email address in order to submit a request"});
    } else if(!request.organization){
      userInfoAlert.setState({ok: false, error: "You must enter the name of your organization in order to submit a request"});
    } else if(!request.emailUser){
      userInfoAlert.setState({ok: false, error: "Your must enter your email address in order to submit a request"});
    } else{
      request.submitRequest(function(err, location){
        if(err){
          submissionAlert.setState({ok:false, error: "" + err});
          submissionAlert.show();
        } else{
          window.location.replace(location.replace('requests', 'processing'));
        }
      });
    }
  });

  $('#vitroRadio').click(function(){
    $('#cleavageRadio').prop('checked', false);
    $('#hybridRadio').prop('checked', false);
  });

  $('#vivoRadio').click(function(){
    $('#cleavageRadio').prop('checked', true);
    $('#hybridRadio').prop('checked', false);
  });



  function PromoterOthersListener(){
    var promo = $('#promoList option:selected').attr('value');
    if(promo == 'Others'){
      $('#promosequence-display').removeClass('invisible');
      $('#footer').css('margin-top', function(){
        return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
      });
    } else{
      $('#promosequence-display').addClass('invisible');
      $('#footer').css('margin-top', function(){
        return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
      });
    }


    $('#promoList').change(function(){

      switch(this.value){
        case 'T7':
          console.log('T7 Promoter Selected');
          $('#promosequence-display').addClass('invisible');
          $('#footer').css('margin-top', function(){
            return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
          });
          break;
        case 'CMV':
          console.log('CMV Promoter Selected');
          $('#promosequence-display').addClass('invisible');
          $('#footer').css('margin-top', function(){
            return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
          });
          break;
        case 'Others':
          $('#promosequence-display').removeClass('invisible');
          $('#footer').css('margin-top', function(){
            return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
          });
          console.log('Manual Input Activated');
          break;
        default:
          $('#promosequence-display').addClass('invisible');
          $('#footer').css('margin-top', function(){
            return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
          });
          break;
      }
    });
  }

  $('#append_promo').click(PromoterOthersListener);

  $('#not_append_promo').click(function(){
    $('#promosequence-display').addClass('invisible');
    $('#footer').css('margin-top', function(){
      return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
    });
  });


  /*$("input[name=promo]:checked").change(function() {

    switch(this.value){
      case 'append':
        if($("#promoList").attr('value') == "Others"){
          $("#promosequence-display").removeClass('invisible');
          $('#footer').css('margin-top', function(){
            return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
          });
        }
        break;
      case 'notappend':
      $("#promosequence-display").addClass('invisible');
      $('#footer').css('margin-top', function(){
        return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
      });
      break;
    }
  });*/
  $("#selectFileButton").click(function() {
    $('#selectFileInput').click();
  });
  
  $('#selectFileInput').change(FileLoader.handleFileBrowsed);

  $("#selectFileOligoButton").click(function() {
    $('#selectFileOligoInput').click();
  });
  
  $('#selectFileOligoInput').change(FileLoader.handleOligoFile);

  $("#signInButton").click(function() {
    $('#signInModal').modal();
  });

  $("#signOutButton").click(function() {
    $(location).attr('href', '/logout');
  });

  $("#shoppingCartButton").click(function() {
    window.location.href = '/orderProcessing';
  });

  $("#bulkOligoAddToCart").click(function() {
    var myRows = new Array;
    var $th = $('table#oligoUploadTable th');
    $('table#oligoUploadTable tbody tr').each(function(i, tr){
        var obj = {}, $tds = $(tr).find('td');
        $th.each(function(index, th){
            obj[$(th).text()] = $tds.eq(index).text();
        });
        myRows.push(obj);
    });
    $('#bulkOligo').attr('value', JSON.stringify(myRows));
  });

  $("#orderConfirmation").click(function() {
      var personalArray = $('#fsOligoPersonal').serializeArray();
      var personalData = { };
      $(personalArray).each(function(index, obj){
        personalData[obj.name] = obj.value;
      });
      $("#personalData").attr("value", JSON.stringify(personalData));
  });

  $("#closeConfirmation").click(function() {
    window.location.href = '/';
  });
}

  function handleResuspend(checkbox){
    if(checkbox.checked){
      console.log("Checkbox is checked!!!");
      $('#resuspendList').removeAttr('disabled');
    } else{
      $('#resuspendList').attr('disabled', 'true');
    }
  }

  // Step 4
  function updatePage(){
    var countErrors = 0;
    request.getRequestStatus(function(err, data){
      var timeoutInterval = 1000 * 5;
      if(err){
        processingAlert.setState({ok: false, error: err});
        countErrors += 1;
        if(countErrors > 3){
          clearTimeout(timeout);
        }
      } else {
        // var remainingMin = data.duration.remainingDuration;
        // timeoutInterval = remainingMin / 10;
        progressBar.update(data.duration.remainingDuration);

        console.log("State of request is " + data.state);
        resultsPanel.updatePanel(data.status);
      }

      var timeout = setTimeout(updatePage, timeoutInterval);
      if(data && data.duration.remainingDuration == 0){
        clearTimeout(timeout);
      }
    });
  };

  function finishStep4(){
    window.location.replace(window.location.href.replace('processing', 'results'));
  };

  var showAlertOffTarget = function(ev){
    var target = $(ev.target);
    try{
        var inx = target.attr('info').split(',');
        var offtar_hits = results.CutsiteTypesCandidateContainer[parseInt(inx[0])].Cutsites[parseInt(inx[1])].OfftargetLocations ;
    var marr = new Array();
  for(var kk = 0 ; kk < offtar_hits.length ; ++kk)
{
  var offtarHit = offtar_hits[kk].split(',');
  offtarHit[0] =  "Gene: <a href='http://www.ncbi.nlm.nih.gov/nuccore/"+offtarHit[0]+"'>" +offtarHit[0] +"</a>";
  offtarHit[1] =  "Percent Match: "+offtarHit[1];
  offtarHit[2] =  "Location at Gene: "+offtarHit[2].substr(1);
  marr.push( offtarHit.join("&nbsp;&nbsp;&nbsp;") );
}

  $("#print").html(marr.join('<br>'));
	ev.stopPropagation();
	$("#offtargetModal").modal();
    }
    catch (err) {
	console.error(err);
    }
};

var showExtraInfo = function(ev){
    var target = $(ev.currentTarget.children[6]);
    var indexes = target.attr('info').split(',').map(function(el){
          return parseInt(el);
    });

    var uset7 = (results.Preferences.promoter != undefined) ;
    var candidate = results.CutsiteTypesCandidateContainer[indexes[0]].Cutsites[indexes[1]].Candidates[indexes[2]];
    $("#sequence").html(GetDisplayHtmlForCandidate (candidate , uset7 ));
    document.getElementById("download-link").href="data:text/plain,"+
    ">Candidate DNA for request " + results.ID + " cut-site type \"" + results.CutsiteTypesCandidateContainer[indexes[0]].Type
    + "\" at location " + (results.CutsiteTypesCandidateContainer[indexes[0]].Cutsites[indexes[1]].Location +1) + " %0D%0A "
    + GetDnaForCandidate(candidate, uset7);
    $("#resultModal").modal();
};
