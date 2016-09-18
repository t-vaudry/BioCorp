var config = require('../ribozyme-design-executor/config/'), 
    nodemailer = require('nodemailer');

module.exports = exports = mailer = {};
var smtpTransport = null;

if(config.environment == "AWS"){
	smtpTransport = nodemailer.createTransport("SES", {
		AWSAccessKeyID: config.awsAccessKeyId,
		AWSSecretKey: config.awsSecretKey,
		SeviceUrl: config.seviceUrl
	});
} else {
	smtpTransport = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: config.user_smtp,
			pass: config.pass_smtp
		}
	});
}

var host = config.host;

mailer.notifyCustomer = function(content){
	var receiver = content.emailaddr;
	var subject = "Order confirmation from Ribosoft";
	var message = "Hello,<br/><p>Your following order is now confirmed.</br/><br/>Regards,<br/>The Ribosoft Team</p>";

    message += "<table>\
        <tbody>\
        <tr>\
            <th>Name</th>\
            <td>" + content.firstname + " " + content.lastname + "</td>\
        </tr>\
        <tr>\
            <th>Account</th>\
            <td>" + content.accHolder + "</td>\
        </tr>\
        <tr>\
            <th>Institution</th>\
            <td>" + content.institution + "</td>\
        </tr>\
        <tr>\
            <th>P. O. Number</th>\
            <td>" + content.ponumber + "</td>\
        </tr>\
        <tr>\
            <th>Invoice</th>\
            <td>" + content.invoice + "</td>\
        </tr>\
        </tbody>\
    </table>";
	var order = content.order;
	for (var i = 0; i < order.length; i++){
		if(order[i].orderType == "oligo"){
		message += "<table>\
			<thead>\
			<th>5' Modification</th>\
			<th>3' Modification</th>\
			<th>Purity</th>\
			<th>Scale</th>\
			<th>Date Requirement</th>\
			<th>Optional</th>\
			</thead>\
			<tbody>\
			<tr>\
				<td>" + order[i].modif5 + "</td>\
				<td>" + order[i].modif3 + "</td>\
				<td>" + order[i].purity + "</td>\
				<td>" + order[i].scale + "</td>\
				<td>" + order[i].datereq + "</td>\
				<td>" + order[i].optional + " " + order[i].resuspend + "</td>\
			</tr>\
			<tr>\
				<th><%=texts.sequence%></th>\
				<td colspan=\"5\">" + order[i].sequence + "</td>\
			</tr>\
			</tbody>\
		</table>";
		} else if(order[i].orderType == "bulkOligo") {
		message += "<table>\
			<thead>";
			for (key in order[i].orderList[0]){
				message += "<th>" + key + "</th>";
			}
			message += "</thead>\
			<tbody>";
			for (var j = 0; j < order[i].orderList.length; j++){
			message += "<tr>";
				for (key in order[i].orderList[j]){
					message += "<td>" + order[i].orderList[j][key] + "</td>";
				}
			message += "</tr>";
			}
			message += "</tbody>\
		</table>";
		}
	}

	var mailOptions = {
		from: "Ribosoft <"+config.user_smtp+">", 
		to: receiver, 
		subject: subject,
		html: message
	};

	smtpTransport.sendMail(mailOptions, function(err){
		if(err){
			console.log(err);
		}
		else if(config.environment != "AWS"){
				smtpTransport.close();
			}
	});
}