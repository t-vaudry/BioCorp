var config = require('../../config/'), 
    nodemailer = require('nodemailer'),
    async = require('async');

module.exports = exports = mailer = {};

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
	user: config.user_smtp,
        pass: config.pass_smtp
    }
});

var host = config.host;

mailer.notifyOwnerRequestFailed = function(request, callback){
    if(!request)
	callback(null, "No owner to notify");
    else {
	var link = host + 'results/'+request.uuid;
	var sendMail = function(request, callback){
	    var receiver = request.emailUser;
	    var subject = "Result from Ribosoft for request "+request.uuid;
	    var message = "Hello,<br/><p>Your request seems to have failed. Please retry at the address "+host+".<br/><br/>When target sequences are more than 3 kb, computing can sometimes be unreasonnably long, try using a portion of the sequence.<br/><br/>Alternatively, by modifying parameters it is possible to increase the number of candidate ribozymes (e.g. longer arm’s lengths will increase the Tm to allow for ribozymes that bind their target well even at higher temperatures).<br/><br/>For a description of the parameters previously used, have a look here: <a href='"+link+"' />"+link+"</a></br/><br/>Regards,<br/>The Ribosoft Team</p>";

	    var mailOptions = {
		from: "Ribosoft <"+config.user_smtp+">", 
		to: receiver, 
		subject: subject,
		html: message
	    };

	    smtpTransport.sendMail(mailOptions, function(err){
		if(err){
		    callback(err);
		}
		else {
		    request.setStatus(5);
		    request.save(function(err, req){
			if(err) callback(err);
			else
			    callback(null);
		    });
		}
	    });
	};

	sendMail(request, function(err){
	    smtpTransport.close();
	    if(err)
		callback(err);
	    else
		callback(null, "Notified owner of blocked process successfully");

	});
    }    
};


mailer.notifyOwners = function(requests, callback){
    var errorArray = [];
    var count = requests.length;

    if(count <= 0)
	callback(null, count);
    else {
	var sendMail = function(request, callback){
	    var receiver = request.emailUser;
	    var link = host + 'results/'+request.uuid;
	    var subject = "Result from Ribosoft for request "+request.uuid;
	    var message = "Hello,<br/><p>Your request has now been completed. You can view the results at the address: <a href='"+link+"' />"+link+"</a>.<br/><br/>Regards,<br/>The Ribosoft Team</p>";

	    var mailOptions = {
		from: "Ribosoft <"+config.user_smtp+">", 
		to: receiver, 
		subject: subject,
		html: message
	    };

	    smtpTransport.sendMail(mailOptions, function(err){
		if(err){
		    callback(err);
		}
		else {
		    request.setStatus(5);
		    request.save(function(err, req){
			if(err) callback(err);
			else
			    callback(null);
		    });
		}
	    });
	};
	
	async.eachSeries(requests, sendMail, function(err){
	    smtpTransport.close();
	    if(err)
		callback(err);
	    else
		callback(null, count);

	});
    }
};

mailer.notifyAdmin = function(data, callback){
    if(data.length == 0)
	callback(null, 0);
    else {
	var receiver = config.admin;
	var subject = "List of organizations - Ribosoft";
	var message = "Hello,<br/><p>List of organizations:<br/>"+data.join("<br/>")+"</p><br/><br/>Regards,<br/>The Ribosoft Team</p>";

	var mailOptions = {
	    from: "Ribosoft <"+config.user_smtp+">", 
	    to: receiver, 
	    subject: subject,
	    html: message
	};

	smtpTransport.sendMail(mailOptions, function(err){
	    if(err){
		callback(err);
	    }
	    else {
		smtpTransport.close();
		callback(null, data.length);
	    }
	});
    }
};

mailer.notifyErrors = function(data, callback){
    if(data.length == 0)
	callback(null, 0);
    else {
	var subject = "Ribosoft - Error caught";
	var message = "Hello,<br/>An error occured. Here is the stacktrace:<br/>"+data+"<br/><br/>Regards,<br/>The Ribosoft Team</p>";

	var mailOptions = {
	    from: "Ribosoft <"+config.user_smtp+">",
	    to: config.devContact,
	    subject: subject,
	    html: message
	};

	smtpTransport.sendMail(mailOptions, function(err){
	    if(err){
		callback(err);
	    }
	    else {
		smtpTransport.close();
		callback(null, data.length);
	    }
	});
    }
};

var outputRequestInfo = function(request){
    var output = "<html> \
        <table width='600' style='border:1px solid #333'> \
      <thead> \
        <tr> \
          <th>Design Option</th> \
          <th>Value</th> \
        </tr> \
      </thead> \
      <tbody>";
      if(request.accessionNumber){
	  output += "	<tr id='accessionNumberRow'> \
          <td>Accession number</td> \
          <td id='accessionNumber'>"+request.accessionNumber+"</td> \
        </tr> ";
      }
      output += " \
        <tr> \
          <td>Sequence Length</td> \
          <td id='seqLength'>"+request.sequence.length+"</td> \
        </tr> \
        <tr id='targetRegionRow'> \
          <td>Target Region</td> \
          <td id='targetRegion'>"+request.getRegion().join(", ")+"</td> \
        </tr> \
        <tr> \
          <td>Target Environment</td> \
          <td id='targetEnv'>In-"+request.getTargetEnv()+"</td> \
        </tr>";
        if(request.getTargetEnv() == 'vivo'){
	    output += " \
	        <tr id='vivoEnvRow' class='invisible'> \
		<td>In-vivo Environment</td> \
		<td id='vivoEnv'>"+request.getEnv().target+"</td> \
            </tr> ";
	}
    output += " \
        <tr> \
          <td>Temperature</td> \
          <td id='tempEnv'>"+request.tempEnv+"</td> \
        </tr> \
        <tr> \
          <td>Na&#8314; Concentration</td> \
          <td id='naEnv'>"+request.naEnv+"</td> \
        </tr> \
        <tr> \
          <td>Mg<sup>2</sup>&#8314; Concentration</td> \
          <td id='mgEnv'>"+request.mgEnv+"</td> \
        </tr> \
        <tr> \
          <td>Oligomer Concentration</td> \
          <td id='oligoEnv'>"+request.oligoEnv+"</td> \
        </tr> \
        <tr> \
          <td>Cut-sites</td> \
          <td id='cutsites'>"+request.cutsites.join(", ")+"</td> \
        </tr> \
        <tr> \
          <td>Fold Shape</td> \
          <td id='foldShape'>"+request.foldShape+"</td> \
        </tr> \
	<tr> \
          <td>Helix I Length</td> \
          <td id='leftArm'>["+request.left_arm_min+", "+request.left_arm_max+"]</td> \
        </tr> \
	<tr> \
          <td>Helix III Length</td> \
          <td id='rightArm'>"+request.right_arm_min+", "+request.right_arm_max+"]</td> \
        </tr> \
	<tr> \
          <td>Use Promoter T7</td> \
          <td id='promoter'>"+(request.promoter? "Yes" : "No")+"</td> \
        </tr> \
	<tr> \
          <td>Specificity</td> \
          <td id='specificity'>"+(request.specificity == "hybrid"? "Cleavage and Hybridization" : "Cleavage only")+"</td> \
        </tr> \
      </tbody> \
    </table> \
    </html>";
}
