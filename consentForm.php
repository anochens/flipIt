<body>
	<br><p>
	<strong>Title of Project:</strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Study on economic decision-making</p>
	<table style="border:0px">
	<tbody>
		<tr>
			<td style="padding-right:5px" valign="top">
				<strong>Principal Investigator:</strong></td>
			<td valign="bottom">
				Alan Nochenson<br>
				309 IST Building<br>
				University Park, 16802<br>
				anochenson@psu.edu</td>
		</tr>
		<tr>
			<td>
			&nbsp;</td>
		</tr>
		<tr>
			<td style="padding-right:5px" valign="top">
				<strong>Advisor:</strong></td>
			<td valign="bottom">
				Jens Grossklags<br>
				329A IST Building<br>
				University Park, 16802<br>
				(814)867-4211; jensg@ist.psu.edu</td>
		</tr>
	</tbody>
	</table>
	<ol>
	<li>
		<strong>Purpose of the Study:</strong>&nbsp; We aim to study how various factors influence economic&nbsp;decision-making.</li>
	<li>
	<strong>Procedures to be followed:</strong>&nbsp; To complete this study, you will fill in a survey questionnaire, read the rules to a game, and then play a number of rounds of the game.</li>
	<li>
	<strong>Duration/Time:</strong> The whole process should take you about 10-15 minutes on average.</li>
	<li>
	<strong>Statement of Confidentiality:</strong> Your participation in this research is confidential. In the event of a publication or presentation resulting from the research, no personally identifiable information will be shared.</li>
	<li>
	<strong>Right to Ask Questions:</strong> Please contact Alan Nochenson at anochenson@psu.edu with questions or concerns about this study. </li>
	<li>
	<strong>Payment for participation:</strong>
You will be compensated according to your performance in this study. For completing the study, you are guaranteed the amount listed on the Mechanical Turk HIT that you have accepted, and you will be paid an additional sum based on your performance.<br> 
You will participate in multiple rounds of the game. At first, you will participate in a practice round without a bonus payment to familiarize yourself with the interface. Then, you will participate in several additional rounds. You can receive a bonus payment for your performance in each of those rounds.<br>
You can increase your bonus payment in a given round by performing well compared to the red player. If you lose by more than 1000 points, however, you will receive no bonus payment for that round.<br> 
The exchange rate for points into the bonus payment is 1 cent for 100 points. For example, you would earn a bonus payment of 10 cents by gaining exactly as many points as the red player. If you outperform your opponent by 500 points you would earn 15 cents. If you underperform you opponent by 500 points you would earn 5 cents.<br>
</li>
 
	<li>
	<strong>Voluntary Participation:</strong> Your decision to take part in this research is voluntary. You can stop at any time. You do not have to answer any questions you do not want to answer. If this is the case, please abandon the Mechanical Turk HIT and exit the survey or game.</li>
		<li>
		You must be 18 years of age or older to consent to take part in this research study.&nbsp; If you agree to take part in this research study and to the conditions outlined above, please click the button below. If you do not consent, please exit the survey now and abandon the Mechanical Turk HIT.</li>
	</ol>

	<form action='index.php' method='GET'>
		<input type='submit' value='I agree to the above terms' />
		<input type='hidden' name='prevPage' value='consentForm' />
		<?php
		if(array_key_exists('lab', $_GET)) {
			echo "<input type='hidden' id='lab' name='lab' value='lab'>\n";
		}
		?>
	</form>
</body>
