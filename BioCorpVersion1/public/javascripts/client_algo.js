/*
    <summary>
     Complements the DNA or RNA string
    </summary>
    <param name='oligo'>The DNA/RNA string to complement</param>
    <param name='isRna'>(Optional) Whether it is RNA. Defaults to true</param>
    <return>The modified string</return>
*/
function Complement( oligo , isRna )
{
	if(isRna == undefined)
		isRna = true;
	var res = new Array();
	for(var ii = 0; ii < oligo.length; ++ii)
	{
		var c = oligo[ii];
		switch(c)
		{
			case 'G':
				res.push('C');
				break;
			case 'C':
				res.push('G');
				break;
			case 'A':
				if(isRna)
					res.push('U');
				else
					res.push('T');
				break;
			case 'U':
			case 'T':
				res.push('A');
					break;
			default:
				res.push(c);
		}
	}
	return res.join('');
}

/*
    <summary>
     Reverses a string
    </summary>
    <param name='oligo'>String to reverse</param>
    <param name='isRna'>(Optional) Whether it is RNA. Defaults to true</param>
    <return>The modified string</return>
*/
function Reverse( oligo )
{
	return oligo.split("").reverse().join("");
}


/*
    <summary>
     Reverse complements a RNA string
    </summary>
    <param name='oligo'>String to reverse complement</param>
    <return>The modified string</return>
*/
function ReverseComplement(oligo)
{
	return Complement(Reverse(oligo));
}


/*
    <summary>
     Transforms a sequence of RNA to DNA
    </summary>
    <param name='seq'>The sequence to change</param>
    <return>The changed string</return>
*/
function RnaToDna(seq)
{
	return seq.replaceAll('U','T');
}

/*
    <summary>
     Transforms a sequence of DNA to RNA
    </summary>
    <param name='seq'>The sequence to change</param>
    <return>The changed string</return>
*/
function DnaToRna(seq)
{
	return seq.replaceAll('T','U');
}
var T7_STRING = 'TAATACGACTCACTATAGGG';
function GetDnaForCandidate( candidate , appendT7 )
{
  var Dnaseq = RnaToDna( ReverseComplement(candidate.Sequence) );
  if(appendT7)
    Dnaseq = AppendPromoter(Dnaseq, T7_STRING , 2);
  return Dnaseq;
}

function GetDisplayHtmlForCandidate( candidate , appendT7 )
{
  var TEMPLATE = 
  "<div class='target-download'>DNA:  </div><b class='utr'>5' - </b>{0}<b class='utr'> - 3'</b><br/>\
  <div class='target-download'>Rz: </div><b class='utr'>3' - </b>{1}<b class='utr'> - 5'</b>\
  ";

  return TEMPLATE.replace('{0}', GetDnaForCandidate( candidate , appendT7 ) ) 
    .replace('{1}', Reverse(candidate.Sequence) ) ;
}

function PrintSequenceWithCutSitesHighlited(seq,cutSites)
{
	var htmlInsert ="";
	var last = 0;
	for(var ii = 0; ii < cutSites.length; ++ii)
	{
		htmlInsert += seq.substr(last, cutSites[ii]);
		htmlInsert += "<b><span class='cut-site'>GUC</span></b>";
		last = cutSites[ii]+3;
	}
	htmlInsert+= seq.substr (last);
	$('.displayUpdate').html( htmlInsert );
}





function DecompressObjectTableIntoObjectArray(table)
{
    var properties = table[0];
    var result = new Array();
    for (var ii = 1 ; ii < table.length; ++ii)
    {
        var obj = new Object();
        for (var jj = 0; jj < properties.length; ++jj)
        {
            obj[properties[jj]] = table[ii][jj];
        }
        result.push(obj);
    }
    return result;
}


function DecompressCandidates(candidates)
{
    candidates = DecompressObjectTableIntoObjectArray(candidates);
    for (var ii = 0; ii < candidates.length ; ++ii)
    {
        var structuresFold = candidates[ii].StructuresSFold;
        candidates[ii].StructuresSFold = DecompressObjectTableIntoObjectArray(structuresFold);
    }
    return candidates;
}

function DecompressRequest(request)
{
    for (var ii = 0; ii < request.CutsiteTypesCandidateContainer.length; ++ii)
    {
        var cutsiteType = request.CutsiteTypesCandidateContainer[ii];
        for (var jj = 0; jj < cutsiteType.Cutsites.length; ++jj)
        {
            var cutsite = cutsiteType.Cutsites[jj];
            var candidates = cutsite.Candidates;
            var decompressedCandidates = DecompressCandidates(candidates);
            cutsite.Candidates = decompressedCandidates;
        }
    }
}

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
          clock = parseInt(click[0].substr(4)) ;// trim from
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

/*
    <summary>
      Appends the given promoter to a given DNA sequence recycling a certain number
      of nucleotides when possibl.
    </summary>
    <param name='candidateDna'> The DNA of the candidate</param>
    <param name='promoter'> The promoter</param>
    <param name='depth'>The amount of the promoter that can be re-used in the DNA (2 for T7)</param>
    <return>The candidate DNA are modified to have the promoter</return>
*/
function AppendPromoter(candidateDna,promoter, depth)
{
	var promAdded =  RnaToDna ( ReverseComplement (promoter) );
	
  var candidate = candidateDna;
  var jj;
  for( jj = 0; jj < depth ;++jj)
  {
    var ii;
    var match = true;
    for( ii = 1 ; ii <= depth - jj; ++ii)
    {
      if( candidate[candidate.length - ii] != promAdded[ii-1] )
      {
        match = false;
        break;
      }
    }
    if(match)
    {
      break;
    }
  }
  var matchBegin = depth - jj;
  candidate += promAdded.substr(matchBegin);
  return candidate;
}

