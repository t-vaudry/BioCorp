
$(document).ready(initializePage);
$(document).on("page:load", initializePage);

  /***** Sequence Selection *****/
  var seqInput = new SequenceInput($('#sequence-display')[0]);
  var seqInput = new SequenceInput($('#sequence-display')[0]);
  var seqAlert = new SequenceAlert($('#sequence_alert'), $('#sequence_alert'));
  var submit1 = $('#submit1');
  var searchAccession = new Button($('#submit_ACN'));
  var accessionAlert = new AccessionAlert($('#accession_alert'));
  var request = new Request();
  var fileLoader = new FileLoader();

    /**** Design Option ******/
  var summary = new SummaryTable();
  var designAlert = new SequenceAlert($('#designAlert'), $('#designAlert2'));
  var validator = new DesignParamsValidator(designAlert);
function initializePage() {

  function fetchInputAccessionNumber(){
    var validator = new AccNumberValidator($('#accession').val());
    if(!validator.getAccessionNumber()){
      return;
    }
    accessionAlert.setState("Searching");
    submit1.addClass('disabled');
  //  seqAlert.hide();
    validator.validate(function(result){
      var input = result.toString();
      var validation = InputValidation.isInputValid(input);
      request.sequence = InputValidation.cleanInput(input);
      seqInput.setText(input);
      seqAlert.setState(validation);
      if(validation.ok){
        console.log(3333333333);
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
  searchAccession.click(fetchInputAccessionNumber);
  seqInput.emptyText();
  submit1.click(function(){
    console.log(request);
    request.originalSequence = request.sequence;
    console.log(request.sequence);
    var selection = $('#rz-select option:selected').attr('value');
    console.log(selection);
    switch(selection){
      case 'hhrz':
        $('#laMin').attr('value', '5');
        $('#laMax').attr('value', '10');
        $('#raMin').attr('value', '5');
        $('#raMax').attr('value', '10');
        break;
      case 'ylrz':
        $('#laMin').attr('value', '8');
        $('#laMax').attr('value', '8');
        $('#raMin').attr('value', '3');
        $('#raMax').attr('value', '12');
        break;
      case 'pistol':
        $('#laMin').attr('value', '4');
        $('#laMax').attr('value', '4');
        $('#raMin').attr('value', '4');
        $('#raMax').attr('value', '34');
        break;
      case 'hdv':
        $('#laMin').attr('value', '0');
        $('#laMax').attr('value', '0');
        $('#raMin').attr('value', '0');
        $('#raMax').attr('value', '0');
        break;
      default:
        break;
    }
  });


  $('#stepTwoFinish').click(function(event){
    var data = $("#msform").serializeArray();
    request.extractData(data);
    console.log(request);
    console.log(data);
    var regionCount = request.region !== undefined ? request.region.length : 0;

    if(regionCount === 0 && request.accessionNumber !== undefined){
      designAlert.setState({ok:false, error:"At least one region must be selected for the sequence (e.q. ORF)"});
      return;
    }

    if(validator.validate(request)){
      designAlert.hide();
      designAlert.setState({ok:true, error:"Searching for UTR..."});
      summary.setTableData(request);
      $('#stepTwoFinish').removeClass('disabled');

      request.sequence = request.originalSequence;
      if(!request.accessionNumber || regionCount == 3){
        designAlert.hide();
      } else{
        FindUTRBoundaries(
          function findingDone(e){
            if(e == 1){
              $('#stepTwoFinish').removeClass('disabled');
            } else if(e === 0){
              designAlert.setState({ok:false, error: "NCBI is not responding or is temporily down." + "Please try again in a minute or select the whole gene. " + "(Multiple searches in a small window of time may " + "cause this)"});
            } else{
              designAlert.setState({ok:false, error:"The region of the RNA you have selected is more than 2000 nucleotides." + "To permit fair use of the software among users, the sequence must be less than 2000 nucleotides. " + "Please select a smaller region or manually trim the sequence in the first step to respect this condition"});
            }
            designAlert.hide();
          }, request);
      }
    }

  });

  function FindUTRBoundaries(ondone)
  {
    $.ajax(
    {
      type: "GET",
      url: "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
      data: {
        db: 'nuccore',
        'id': request.accessionNumber,
        retmode: 'text'
        },
      success: function(d) {
          //alert(d);
          clack = d;
          var ThreeUTRInfo = clack.indexOf("3'UTR");
          var FiveUTRInfo = clack.indexOf("5'UTR");
          var ORFInfo = clack.indexOf("cdregion");
          var clock = 0;
          var cluck = 0;
          request.OriginalSequence = request.sequence;
          if( request.region[0] == "3'" && (ThreeUTRInfo != -1 ) )
          {

            //This monster grabs the "from x,    to y" right after the tag found
            var cleck =  clack.substr(clack.indexOf("from",ThreeUTRInfo), clack.indexOf ( "," ,clack.indexOf( "to" ,ThreeUTRInfo) ) -clack.indexOf("from",ThreeUTRInfo)) ;
            var click = cleck.split(","); //This small thing splits it into "from" and "to"
            clock = parseInt(click[0].substr(4)) ;// trim from
            cluck = parseInt(click[1].trim().substr(2) ) ; // get to
            request.sequence = request.OriginalSequence.substr(clock, cluck - clock +1 );

          }
          else if ( ORFInfo != -1)
          {
            //This monster grabs the "from x,    to y" right after the tag found
            var cleck =  clack.substr(clack.indexOf("from",ORFInfo), clack.indexOf ( "," ,clack.indexOf( "to" ,ORFInfo) ) - clack.indexOf("from",ORFInfo)) ;
            var click = cleck.split(","); //This small thing splits it into "from" and "to"
            clock = parseInt(click[0].substr(4));// trim from
            cluck = parseInt(click[1].trim().substr(2) ) ; // get to

            var ORF =
               request.OriginalSequence.substr(clock, cluck - clock +1);
            var ARF =
               request.OriginalSequence.substr(cluck);
            var URF =
               request.OriginalSequence.substr(0,clock);

            if( request.region.length == 1)
            {
              if(request.region[0] = "3'")
                request.sequence = URF;
              else if( request.region[0] = "5'" )
                request.sequence = ARF;
              else
                request.sequence = ORF;
            }
            else
            {
              if(request.region[0] = "3'")
                request.sequence = ARF + ORF;
              else
                request.sequence = ORF + URF;
            }
          }
          if( request.sequence.length <= 2000 )
            ondone(1);
          else
            ondone(2);
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
          alert("Could not access Genbank for UTR info. Error: " + errorThrown + "; Code: "+ textStatus);
          ondone(0);
        }
    }
    );
  }

  $('#vitroRadio').click(function(){
    $('#cleavageRadio').prop('checked', false);
    $('#hybridRadio').prop('checked', false);
    $('#notcomputedRadio').prop('checked', true);
  });

  $('#vivoRadio').click(function(){
    $('#cleavageRadio').prop('checked', true);
    $('#hybridRadio').prop('checked', false);
    $('#notcomputedRadio').prop('checked', false);
  });

  function PromoterOthersListener(){
    var promo = $('#promoList option:selected').attr('value');
    if(promo == 'Others'){
      $('#promosequence-display').removeClass('invisible');
    } else{
      $('#promosequence-display').addClass('invisible');
    }

    $('#promoList').change(function(){

      switch(this.value){
        case 'T7':
          console.log('T7 Promoter Selected');
          $('#promosequence-display').addClass('invisible');
          break;
        case 'CMV':
          console.log('CMV Promoter Selected');
          $('#promosequence-display').addClass('invisible');
          break;
        case 'Others':
          $('#promosequence-display').removeClass('invisible');
          console.log('Manual Input Activated');
          break;
        default:
          $('#promosequence-display').addClass('invisible');
          break;
      }
    });
  }

  $('#append_promo').click(PromoterOthersListener);

  $('#not_append_promo').click(function(){
    $('#promosequence-display').addClass('invisible');
  });

  $('#selectFileInput').change(FileLoader.handleFileBrowsed);

}
