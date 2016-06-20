
$(document).ready(initializePage);
$(document).on("page:load", initializePage)


function initializePage() {
  var seqInput = new SequenceInput($('#sequence-display')[0]);
  var seqAlert = new SequenceAlert($('#sequence_alert'));
  var submit1 = $('#submit1');
  var searchAccession = new Button($('#submit_ACN'));
  var accessionAlert = new AccessionAlert($('#accession_alert'));

  function fetchInputAccessionNumber(){
    var validator = new AccNumberValidator($('#accession').val());
    if(!validator.getAccessionNumber()){
      return;
    }
    accessionAlert.setState("Searching");
    submit1.addClass('disabled');
    seqAlert.hide();
    validator.validate(function(result){
      var input = result.toString();
      var validation = InputValidation.isInputValid(input);
      seqInput.setText(input);
      seqAlert.setState(validation);
      if(validation.ok){
        console.log(3333333333)
        submit1.removeClass('disabled');
      }
      accessionAlert.setState("Success");
    },
    function(error){
      accessionAlert.setState("Failure");
    })  ;

  };
  console.log("document loaded!!");
  searchAccession.click(fetchInputAccessionNumber);
  seqInput.emptyText();

};

$(window).load(function(){
  console.log("window loaded!!");

});



function AccNumberValidator(accessionNumber){
  this.accessionNumber = accessionNumber;
  this.isValid = false;
}

AccNumberValidator.prototype.validate = function(successCallback, errorCallback){
  var self = this;
  $.$.ajax({
    url: 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi',
    type: 'GET',
    data: {
      db: 'nuccore',
      'id': this.accessionNumber,
      rettype: 'fasta',
      retmode: 'text'
    },
    success: function(d){
      self.isValid = true;
      successCallback(d);
    },
    error: function(jqXHR, textStatus, errorThrown){
      self.isValid = false;
      errorCallback(errorThrown);
    }
  });
}

AccNumberValidator.prototype.getValidAccessionNumber = function(){
  return this.isValid? this.accessionNumber : '';
}

AccNumberValidator.prototype.getAccessionNumber = function(){
  return this.accessionNumber;
}


/***** Step 2. Design Options *****/
// Only activate modal.
function handleQuestionClick(event){
  var el = $(".")
}
