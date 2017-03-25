function FileLoader(textField) {
}

FileLoader.readFile = function(fileToRead) {

    var reader = new FileReader();
    reader.readAsText(fileToRead);
    reader.onload = function() {
	     var input = reader.result;
       console.log(input);
	     var validation = InputValidation.isInputValid(input);

	     seqInput.setText(input);
	     request.sequence = InputValidation.cleanInput(input);
	     seqAlert.setState(validation);
        if(validation.ok){
	        submit1.removeClass('disabled');
          window.setTimeout(function(){
            seqAlert.hide();
          }, 3000);
        }
       request.accessionNumber = '';
       $('#accession').text('');
    };
}

FileLoader.handleFileBrowsed  = function(evt) {
    file = $('#selectFileInput')[0].files[0];
    FileLoader.readFile(file);
}

FileLoader.handleOligoFile  = function(evt) {
    file = $('#selectFileOligoInput')[0].files[0];
    FileLoader.readOligoFile(file);
}

FileLoader.readOligoFile = function(fileToRead) {

    var reader = new FileReader();
    reader.readAsBinaryString(fileToRead);
    reader.onload = function() {
        var input = reader.result;
        var workbook = XLSX.read(input, {type : 'binary'});
        var XL_row_object = null;
        workbook.SheetNames.forEach(function(sheetName){
            // Here is your object
            XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        })

        var tableStr = "";
        tableStr += "<thead><tr>";
        tableStr += "<th>Sequence No</th>";
        tableStr += "<th>Oligo Name</th>";
        tableStr += "<th>5' Modification</th>";
        tableStr += "<th>3' Modification</th>";
        tableStr += "<th>Sequence</th>";
        tableStr += "<th>Purity</th>";
        tableStr += "<th>Scale</th>";
        // for(var prop in csvArray[0]){
        //     tableStr += "<th>" + prop + "</th>";            
        // }
        tableStr += "</tr></thead>";        
        tableStr += "<tbody>";        
        for(var index in XL_row_object){
            var row = XL_row_object[index];
            tableStr += "<tr id='oligoUploadTableRow" + index + "'>";        
            for(var prop in row){
                tableStr += "<td>" + row[prop] + "</td>";            
            }
            tableStr += "<td><a row-index='" + index + "' class='removeOligo'>Remove</a></td></tr>";        
        }
        tableStr += "</tbody>";
        $('#oligoUploadTable').empty();
        $('#oligoUploadTable').append(tableStr);
        $('.removeOligo').click(function(){
            var row_index = $(this).attr('row-index');
            $('#oligoUploadTableRow' + row_index).remove();
        })
        $('#oligoFileUploadModal').modal();
    };
}

String.prototype.endsWith = function(substr){
    return this.substring(this.indexOf(substr)) == substr;
};


String.prototype.indexOfMultiple=function(Arr)
{
    var indexs = new Array();
    //Make an array of the multiple first instances of Arr[ii]
    for(var ii = 0; ii < Arr.length ; ++ii)
    {
	indexs.push(this.indexOf(Arr[ii]));
    }

    var min = this.length;
    for(var ii = 0; ii < indexs.length; ++ii)
    {
	if(indexs[ii] != -1 && indexs[ii] < min)
	    min = indexs[ii];
    }
    if(min == this.length)
	min = -1;
    return min;
}

String.prototype.replaceAt=function(index, string, len)
{
    if(len == undefined)
	len = 1;

    return this.substr(0, index) + string + this.substr(index+len);

}

String.prototype.replaceAll = function(find,replace)
{
    return this.replace(new RegExp(find, 'g'), replace);
}


//pads left
String.prototype.PadLeft = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

//pads right
String.prototype.PadRight = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = str + padString;
    return str;
}

function AccNumberValidator(accessionNumber){
    this.accessionNumber = accessionNumber;
    this.isValid = false;
}

AccNumberValidator.prototype.validate = function(successCallback, errorCallback){
    var self = this;
        $.ajax({
        type: "GET",
        url: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
        data: {
            db: 'nuccore',
            'id': this.accessionNumber,
            rettype: 'fasta',
            retmode: 'text'
        },
        success: function(d) {
	    self.isValid = true;
            successCallback(d);
        },
        error: function(jqXHR, textStatus, errorThrown) {
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


function AccessionAlert(el){
    this.el = el;
}

//States: ["Searching", "Success", "Failure"]
AccessionAlert.prototype.setState = function(state){
    switch(state){
    case "Searching":
	this.el.removeClass("invisible alert-error alert-success");
	this.el.text("Searching NCBI database...");
	break;
    case "Success":
	this.el.addClass("alert-success");
        this.el.text("Sequence found!");
	break;
    case "Failure":
	this.el.removeClass("alert-success");
	this.el.addClass("alert-error");
	this.el.text("No results found for this accession number");
	break;
    default:
	this.el.removeClass();
	this.el.text("");
    }
}

AccessionAlert.prototype.hide = function(){
    this.el.addClass("invisible");
};


function InputValidation(){}

InputValidation.validateInput= function(input){
    var badInput = false;
    var Problems = '';
    var isRNA = true;
    if(input == "")
        return {"ok" : false , "error" : "Empty Input"};
    for(var ii = 0; ii < input.length; ++ii)
    {
        if(input[ii] ==' ' || input[ii] =='\n')
            continue;
        if(input[ii] != 'T' && input[ii] != 'U' && input[ii] != 'G' && input[ii] != 'C' && input[ii] != 'A')
        {
            Problems = "Unrecognized nucleotide: " + input[ii];
            badInput = true;
            break;
        }
    }
    if(badInput)
        return {"ok" : false , "error" :Problems};

    for(var ii = 0; ii < input.length; ++ii)
    {
        if(input[ii] ==' ')
            continue;
        if(input[ii] == 'T')
        {
            isRNA = false;
            break;
        }
    }
    for(var ii = 0; ii < input.length; ++ii)
    {
        if(input[ii] ==' ' || input[ii] == '\n')
            continue;
        if((isRNA && input[ii] =='T') || (!isRNA && input[ii] == 'U'))
        {
            console.log("@" + ii + ":" + input[ii]);
            Problems = "Inconsistent input (T and U): Check that your input is either DNA or RNA";
            badInput = true;
            break;
        }
    }

    if(badInput)
        return {"ok" : false , "error" :Problems};

    return {"ok" : true, "error" : "Sequence Found!" };
}

InputValidation.validateOligoInput= function(input){
    var badInput = false;
    var Problems = '';
    var isRNA = true;
    if(input == "")
        return {"ok" : false , "error" : "Empty Input"};
    for(var ii = 0; ii < input.length; ++ii)
    {
        if(input[ii] ==' ' || input[ii] =='\n')
            continue;
        if(input[ii] != 'T' 
        && input[ii] != 'U' 
        && input[ii] != 'G' 
        && input[ii] != 'C' 
        && input[ii] != 'A'
        && input[ii] != 'R' 
        && input[ii] != 'Y' 
        && input[ii] != 'K' 
        && input[ii] != 'M'
        && input[ii] != 'S' 
        && input[ii] != 'W' 
        && input[ii] != 'B' 
        && input[ii] != 'D'
        && input[ii] != 'H' 
        && input[ii] != 'V' 
        && input[ii] != 'N')
        {
            Problems = "Unrecognized nucleotide: " + input[ii];
            badInput = true;
            break;
        }
    }
    if(badInput)
        return {"ok" : false , "error" :Problems};

    for(var ii = 0; ii < input.length; ++ii)
    {
        if(input[ii] ==' ')
            continue;
        if(input[ii] == 'T')
        {
            isRNA = false;
            break;
        }
    }
    for(var ii = 0; ii < input.length; ++ii)
    {
        if(input[ii] ==' ' || input[ii] == '\n')
            continue;
        if((isRNA && input[ii] =='T') || (!isRNA && input[ii] == 'U'))
        {
            console.log("@" + ii + ":" + input[ii]);
            Problems = "Inconsistent input (T and U): Check that your input is either DNA or RNA";
            badInput = true;
            break;
        }
    }

    if(badInput)
        return {"ok" : false , "error" :Problems};

    return {"ok" : true, "error" : "Sequence Found!" };
}

InputValidation.cleanInput = function( input )
{
    //FASTA
    input = input.toUpperCase();
    input = input.trim();
    var fastaCommentStart = input.indexOfMultiple(['>' , ';']);
    do
    {
        if(fastaCommentStart != -1 )
        {
            var endofFastaComment =  input.indexOf('\n');
            if(endofFastaComment > fastaCommentStart)
            {
                if( endofFastaComment != -1 )
                {
                    input = input.substr( input.indexOf('\n') + 1);
                }
            }
            else //This means the comment is not terminated by a new-line. The entire thing is garbage. The validator will scream
            { //Or is preceeded by a line break, which means it is not proper FASTA
                input = "";
                break;
            }
        }
        fastaCommentStart = input.indexOfMultiple(['>' , ';']);
    } while(fastaCommentStart != -1 );
    //END FASTA

    input = input.replace(/[ \t\r\n]+/g, '');//This removes all white-space from the returned string
    return input;
}

InputValidation.isInputValid = function(str){
    return InputValidation.validateInput(InputValidation.cleanInput(str));
};

InputValidation.isOligoInputValid = function(str){
    return InputValidation.validateOligoInput(InputValidation.cleanInput(str));
};

function SequenceInput(el){
    this.el = el;
}


SequenceInput.prototype.isInputValid = function(){
    return InputValidation.isInputValid(this.el.value);
};

SequenceInput.prototype.setText = function(text){
    this.el.value = text;
};

SequenceInput.prototype.getText = function(){
    return this.el.value;
};


SequenceInput.prototype.emptyText = function(){
    if(this.el !== undefined){
        this.el.value = "";
    }
};

SequenceInput.prototype.isEmptyText = function(){
    return this.el.value.length == 0? true: false;
};


function SequenceAlert(el, el2){
    this.el = el;
    this.el2 = el2;

}

//state = {"ok": "true/false" , "error" : "<str>"}
SequenceAlert.prototype.setState = function(state){
    this.el.removeClass("invisible");
    this.el2.removeClass('invisible');

    if(state.ok === false){
	     this.el.addClass("alert-error").removeClass("alert-success");
       this.el2.addClass('alert-error').removeClass('alert-success');
    }
    else {
	     this.el.removeClass("alert-error").addClass("alert-success");
       this.el2.removeClass('alert-error').addClass('alert-success');
    }
    this.el.text(state.error);
    this.el2.text(state.error);

};

SequenceAlert.prototype.hide = function(){
    this.el.addClass("invisible");
    this.el.removeClass("alert-error alert-success");
    this.el2.addClass("invisible");
    this.el2.removeClass("alert-error alert-success");

};

SequenceAlert.prototype.show = function(){
    this.el.removeClass("invisible");
    this.el2.removeClass("invisible");

};


function Button(el){
    this.el = el;
}

Button.prototype.click = function(callback){
    this.el.click(callback);
    this.callback = callback;
}

Button.prototype.disable = function(){
    this.el.addClass("disabled");
    this.el.unbind('click');
}

Button.prototype.enable = function(){
    this.el.removeClass("disabled");
    this.el.bind('click');
    this.el.click(this.callback);
};

function DesignContent(formEl, iconEls, designHelpEl) {
    this.designForm = formEl;
    this.questionIcons = iconEls;
    this.designHelp = designHelpEl;
}

DesignContent.prototype.showDesignHelp = function(event){
    var elem = $(event.target);
    if(!elem.attr('expanded'))
    {
	this.designHelp.removeClass("invisible");
	var css1 = this.designForm.css('width');
	var css2 = this.questionIcons.css('margin-right');
	elem.attr('expanded', css1+';' + css2 );
        this.designForm.animate({'width':'50%'},250);
//	this.questionIcons.animate({'margin-right':'0%'},250);
	this.designForm.addClass("pressed");
	$(elem).popover();
    }
    else
    {
	this.designHelp.addClass("invisible");
	var css = elem.attr('expanded').split(';');
	elem.attr('expanded','');
	this.designForm.removeClass("pressed");
	this.designForm.animate({'width':css[0]},250);
//	this.questionIcons.animate({'margin-right':css[1]},250);
    }
}

function SmartDropdown(el){
    this.el = el;
}

SmartDropdown.prototype.setState = function(currentState, disable){
    disable?
	this.el.prop("disabled", currentState):
	this.el.prop("disabled", !currentState);
}

function SmartFieldSet(el, elHelp, elRow){
    this.el = el;
    this.elHelp = elHelp;
    this.elRow = elRow;
}

SmartFieldSet.prototype.setState = function(show){
    if(!show){
	this.el.addClass("invisible");
	this.elHelp.addClass("invisible");
	this.elRow.addClass("invisible");
    }
}


function SummaryTable(){}

SummaryTable.prototype.setTableData = function(data){
    console.log(data.cutsites);
    if(data.env.target){
	$("#vivoEnvRow").removeClass("invisible");
    }
    if(data.accessionNumber){
    	$("#accessionNumberRow").removeClass("invisible");
	    $("#targetRegionRow").removeClass("invisible");
    }
    $("#accessionNumber").text(data.accessionNumber);
    $("#seqLength").text(data.sequence.length + " nucleotides");
    $("#targetRegion").text(data.region);
    $("#targetEnv").text("In-"+data.env.type);
    $("#vivoEnv").text(data.env.target);
    $("#tempEnv").html(data.temperature + ' &#8451');
    $("#naEnv").text(data.naC + ' mM');
    $("#mgEnv").text(data.mgC + ' mM');
    $("#oligoEnv").text(data.oligoC + ' nM');
    $("#cutsites").text(data.cutsites.join(", "));
    // $("#promoter").text(data.promoter ? "Yes" : "No");
    var ribozymeText = data.ribozymeSelection;
    $(".ribozymeNameList").each(function(){
        if($(this).attr('value') == data.ribozymeSelection){
            ribozymeText = $(this).attr('title');
        }
    });
    $("#ribozymeType").text(ribozymeText);
    if(typeof data.left_arm_min !== 'undefined' && typeof data.left_arm_max !== 'undefined'
        && data.left_arm_min > 0 && data.left_arm_max > 0){
        $("#leftArm").text("Between "+ data.left_arm_min + " and "+data.left_arm_max);
    }
    if(typeof data.right_arm_min !== 'undefined' && typeof data.right_arm_max !== 'undefined'
        && data.right_arm_min > 0 && data.right_arm_max > 0){
        $("#rightArm").text("Between "+ data.right_arm_min + " and "+data.right_arm_max);
    }
    $("#specificity").text(data.specificity == "hybrid"?"Cleavage and Hybridization":"Cleavage only");
}

function BackPressHandler(){}

BackPressHandler.handler = function(event){
    if(!$("#step2").hasClass("invisible"))
	;
};

function ProgressBar(el, elText, request){
    this.el = el;
    this.elText = elText;
    this.request = request;
}

var oldValue = 120;
var firstTime = true;
ProgressBar.prototype.update = function(duration){
    var newVal = duration;
    if(firstTime && duration < oldValue){
        oldValue = newVal;
        firstTime = false;
    }
    if(duration == 0)
	var percentage = 99;
    else {
	    percentage = Math.max(1, Math.round(((oldValue - newVal)/oldValue)*100));
    }
    this.elText.text(duration + " minutes, Progress: " + (percentage+1)+"%");
    this.el.css('width', (percentage+1)+"%");
}

function StateReporter(el){
    this.el = el
};

// str is a '\n'-separated string
StateReporter.prototype.updateState = function(str){
    var stateLog = str;
    while(stateLog.indexOf('\n') != -1)
    {
        stateLog = stateLog.replace('\n','</div><br><div class="state-log">');
    }
    this.el.html('<div class="state-log">' + stateLog + '</div>' );
}

function ResultsPanel(el){
    this.el = el;
};

ResultsPanel.prototype.updatePanel = function(status){
    if(status == "Processed") {
        this.el.removeClass("invisible");
    }
}

function EmailReporter(panel1, panel2, alert){
    this.panel1 = panel1;
    this.panel2 = panel2;
    this.alert = new SequenceAlert(alert);
}

EmailReporter.prototype.submit = function(value){
    this.alert.hide();
    if(!value)
    {
	this.alert.setState({ok: false, error:"Email Input is empty."});
	this.alert.show();
	return;
    }
    var self = this;
    Request.getRequest(function(err, request){
	if(err){
	    self.alert.setState({ok: false, error:"Could not reach the server. Please try again later."});
	    self.alert.show();
	}
	else{
	    request.emailUser = value;
	    request.updateRequest(function(err, request){
		if(err) {
		    self.alert.setState({ok: false, error:"Could not reach the server. Please try again later."});
		    self.alert.show();
		}
		else {
		    self.panel1.addClass("invisible");
		    self.panel2.removeClass("invisible");
		}
	    });
	}
    });
}

function DesignParamsValidator(alert){
    this.alert = alert;
}

DesignParamsValidator.prototype.validate = function(request){
    var valid = false;
    if(request.accessionNumber && !request.region) {
	this.alert.setState({ok:false, error:"You must specify the target region when using the accession number"});
    }
    else if(request.region.length == 2 && request.region.join("") == "5'3'" ) {
	this.alert.setState({ok:false, error:"You must specify contiguous target region segments: the frames 5' and 3' are not contiguous"});
    }
    else if(!request.env || (request.env.type == "vivo" && !request.env.target)){
	this.alert.setState({ok:false, error:"You must specify the target environment and target organism"});
    }
    else if(request.cutsites.length > 2){
	this.alert.setState({ok:false, error:"Please select up to two cut-site types such as GUC and AUC."});
    }
    else if( (request.temperature < -272) ) {
	this.alert.setState({ok:false, error:"Temperature cannot be below -272&#176;C"});
    }
    else if( (request.naC < 0) || (request.mgC < 0) || (request.oligoC < 0) ) {
	this.alert.setState({ok:false, error:"Environment concentrations cannot be below 0"});
    }
    else if( parseInt(request.left_arm_min) > parseInt(request.left_arm_max)  
        || parseInt(request.right_arm_min) > parseInt(request.right_arm_max) )
    {
    this.alert.setState({ok:false, error:"Minimum arm length should be greater than maximum"});
    }
    else {
	this.alert.hide();
	valid = true;
    }
    return valid;
};

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}