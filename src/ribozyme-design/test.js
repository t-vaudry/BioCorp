console.log(" ********************** Testing Request Handle ********************** ");
var TestObj = require('./HandleRequest.js');
var MODEL = require('./model/');
var Request = MODEL.DomainObjects.Request;

//var TestObj = require( './HandleRequest.js');

var stress_test  = 'GUGGCGCGAGCUUCUGAAACUAGGCGGCAGAGGCGGAGCCGCUGUGGCACUGCUGCGCCUCUGCUGCGCCUCGGGUGUCUUUUGCGGCGGUGGGUCGCCGCCGGGAGAAGCGUGAGGGGACAGAUUUGUGACCGGCGCGGUUUUUGUCAGCUUACUCCGGCCAAAAAAGAACUGCACCUCUGGAGCGGACUUAUUUACCAAGCAUUGGAGGAAUAUCGUAGGUAAAAAUGCCUAUUGGAUCCAAAGAGAGGCCAACAUUUUUUGAAAUUUUUAAGACACGCUGCAACAAAGCAGAUUUAGGACCAAUAAGUCUUAAUUGGUUUGAAGAACUUUCUUCAGAAGCUCCACCCUAUAAUUCUGAACCUGCAGAAGAAUCUGAACAUAAAAACAACAAUUACGAACCAAACCUAUUUAAAACUCCACAAAGGAAACCAUCUUAUAAUCAGCUGGCUUCAACUCCAAUAAUAUUCAAAGAGCAAGGGCUGACUCUGCCGCUGUACCAAUCUCCUGUAAAAGAAUUAGAUAAAUUCAAAUUAGACUUAGGAAGGAAUGUUCCCAAUAGUAGACAUAAAAGUCUUCGCACAGUGAAAACUAAAAUGGAUCAAGCAGAUGAUGUUUCCUGUCCACUUCUAAAUUCUUGUCUUAGUGAAAGUCCUGUUGUUCUACAAUGUACACAUGUAACACCACAAAGAGAUAAGUCAGUGGUAUGUGGGAGUUUGUUUCAUACACCAAAGUUUGUGAAGGGUCGUCAGACACCAAAACAUAUUUCUGAAAGUCUAGGAGCUGAGGUGGAUCCUGAUAUGUCUUGGUCAAGUUCUUUAGCUACACCACCCACCCUUAGUUCUACUGUGCUCAUAGUCAGAAAUGAAGAAGCAUCUGAAACUGUAUUUCCUCAUGAUACUACUGCUAAUGUGAAAAGCUAUUUUUCCAAUCAUGAUGAAAGUCUGAAGAAAAAUGAUAGAUUUAUCGCUUCUGUGACAGACAGUGAAAACACAAAUCAAAGAGAAGCUGCAAGUCAUGGAUUUGGAAAAACAUCAGGGAAUUCAUUUAAAGUAAAUAGCUGCAAAGACCACAUUGGAAAGUCAAUGCCAAAUGUCCUAGAAGAUGAAGUAUAUGAAACAGUUGUAGAUACCUCUGAAGAAGAUAGUUUUUCAUUAUGUUUUUCUAAAUGUAGAACAAAAAAUCUACAAAAAGUAAGAACUAGCAAGACUAGGAAAAAAAUUUUCCAUGAAGCAAACGCUGAUGAAUGUGAAAAAUCUAAAAACCAAGUGAAAGAAAAAUACUCAUUUGUAUCUGAAGUGGAACCAAAUGAUACUGAUCCAUUAGAUUCAAAUGUAGCAAAUCAGAAGCCCUUUGAGAGUGGAAGUGACAAAAUCUCCAAGGAAGUUGUACCGUCUUUGGCCUGUGAAUGGUCUCAACUAACCCUUUCAGGUCUAAAUGGAGCCCAGAUGGAGAAAAUACCCCUAUUGCAUAUUUCUUCAUGUGACCAAAAUAUUUCAGAAAAAGACCUAUUAGACACAGAGAACAAAAGAAAGAAAGAUUUUCUUACUUCAGAGAAUUCUUUGCCACGUAUUUCUAGCCUACCAAAAUCAGAGAAGCCAUUAAAUGAGGAAACAGUGGUAAAUAAGAGAGAUGAAGAGCAGCAUCUUGAAUCUCAUACAGACUGCAUUCUUGCAGUAAAGCAGGCAAUAUCUGGAACUUCUCCAGUGGCUUCUUCAUUUCAGGGUAUCAAAAAGUCUAUAUUCAGAAUAAGAGAAUCACCUAAAGAGACUUUCAAUGCAAGUUUUUCAGGUCAUAUGACUGAUCCAAACUUUAAAAAAGAAACUGAAGCCUCUGAAAGUGGACUGGAAAUACAUACUGUUUGCUCACAGAAGGAGGACUCCUUAUGUCCAAAUUUAAUUGAUAAUGGAAGCUGGCCAGCCACCACCACACAGAAUUCUGUAGCUUUGAAGAAUGCAGGUUUAAUAUCCACUUUGAAAAAGAAAACAAAUAAGUUUAUUUAUGCUAUACAUGAUGAAACAUCUUAUAAAGGAAAAAAAAUACCGAAAGACCAAAAAUCAGAACUAAUUAACUGUUCAGCCCAGUUUGAAGCAAAUGCUUUUGAAGCACCACUUACAUUUGCAAAUGCUGAUUCAGGUUUAUUGCAUUCUUCUGUGAAAAGAAGCUGUUCACAGAAUGAUUCUGAAGAACCAACUUUGUCCUUAACUAGCUCUUUUGGGACAAUUCUGAGGAAAUGUUCUAGAAAUGAAACAUGUUCUAAUAAUACAGUAAUCUCUCAGGAUCUUGAUUAUAAAGAAGCAAAAUGUAAUAAGGAAAAACUACAGUUAUUUAUUACCCCAGAAGCUGAUUCUCUGUCAUGCCUGCAGGAAGGACAGUGUGAAAAUGAUCCAAAAAGCAAAAAAGUUUCAGAUAUAAAAGAAGAGGUCUUGGCUGCAGCAUGUCACCCAGUACAACAUUCAAAAGUGGAAUACAGUGAUACUGACUUUCAAUCCCAGAAAAGUCUUUUAUAUGAUCAUGAAAAUGCCAGCACUCUUAUUUUAACUCCUACUUCCAAGGAUGUUCUGUCAAACCUAGUCAUGAUUUCUAGAGGCAAAGAAUCAUACAAAAUGUCAGACAAGCUCAAAGGUAACAAUUAUGAAUCUGAUGUUGAAUUAACCAAAAAUAUUCCCAUGGAAAAGAAUCAAGAUGUAUGUGCUUUAAAUGAAAAUUAUAAAAACGUUGAGCUGUUGCCACCUGAAAAAUACAUGAGAGUAGCAUCACCUUCAAGAAAGGUACAAUUCAACCAAAACACAAAUCUAAGAGUAAUCCAAAAAAAUCAAGAAGAAACUACUUCAAUUUCAAAAAUAACUGUCAAUCCAGACUCUGAAGAACUUUUCUCAGACAAUGAGAAUAAUUUUGUCUUCCAAGUAGCUAAUGAAAGGAAUAAUCUUGCUUUAGGAAAUACUAAGGAACUUCAUGAAACAGACUUGACUUGUGUAAACGAACCCAUUUUCAAGAACUCUACCAUGGUUUUAUAUGGAGACACAGGUGAUAAACAAGCAACCCAAGUGUCAAUUAAAAAAGAUUUGGUUUAUGUUCUUGCAGAGGAGAACAAAAAUAGUGUAAAGCAGCAUAUAAAAAUGACUCUAGGUCAAGAUUUAAAAUCGGACAUCUCCUUGAAUAUAGAUAAAAUACCAGAAAAAAAUAAUGAUUACAUGAACAAAUGGGCAGGACUCUUAGGUCCAAUUUCAAAUCACAGUUUUGGAGGUAGCUUCAGAACAGCUUCAAAUAAGGAAAUCAAGCUCUCUGAACAUAACAUUAAGAAGAGCAAAAUGUUCUUCAAAGAUAUUGAAGAACAAUAUCCUACUAGUUUAGCUUGUGUUGAAAUUGUAAAUACCUUGGCAUUAGAUAAUCAAAAGAAACUGAGCAAGCCUCAGUCAAUUAAUACUGUAUCUGCACAUUUACAGAGUAGUGUAGUUGUUUCUGAUUGUAAAAAUAGUCAUAUAACCCCUCAGAUGUUAUUUUCCAAGCAGGAUUUUAAUUCAAACCAUAAUUUAACACCUAGCCAAAAGGCAGAAAUUACAGAACUUUCUACUAUAUUAGAAGAAUCAGGAAGUCAGUUUGAAUUUACUCAGUUUAGAAAACCAAGCUACAUAUUGCAGAAGAGUACAUUUGAAGUGCCUGAAAACCAGAUGACUAUCUUAAAGACCACUUCUGAGGAAUGCAGAGAUGCUGAUCUUCAUGUCAUAAUGAAUGCCCCAUCGAUUGGUCAGGUAGACAGCAGCAAGCAAUUUGAAGGUACAGUUGAAAUUAAACGGAAGUUUGCUGGCCUGUUGAAAAAUGACUGUAACAAAAGUGCUUCUGGUUAUUUAACAGAUGAAAAUGAAGUGGGGUUUAGGGGCUUUUAUUCUGCUCAUGGCACAAAACUGAAUGUUUCUACUGAAGCUCUGCAAAAAGCUGUGAAACUGUUUAGUGAUAUUGAGAAUAUUAGUGAGGAAACUUCUGCAGAGGUACAUCCAAUAAGUUUAUCUUCAAGUAAAUGUCAUGAUUCUGUUGUUUCAAUGUUUAAGAUAGAAAAUCAUAAUGAUAAAACUGUAAGUGAAAAAAAUAAUAAAUGCCAACUGAUAUUACAAAAUAAUAUUGAAAUGACUACUGGCACUUUUGUUGAAGAAAUUACUGAAAAUUACAAGAGAAAUACUGAAAAUGAAGAUAACAAAUAUACUGCUGCCAGUAGAAAUUCUCAUAACUUAGAAUUUGAUGGCAGUGAUUCAAGUAAAAAUGAUACUGUUUGUAUUCAUAAAGAUGAAACGGACUUGCUAUUUACUGAUCAGCACAACAUAUGUCUUAAAUUAUCUGGCCAGUUUAUGAAGGAGGGAAACACUCAGAUUAAAGAAGAUUUGUCAGAUUUAACUUUUUUGGAAGUUGCGAAAGCUCAAGAAGCAUGUCAUGGUAAUACUUCAAAUAAAGAACAGUUAACUGCUACUAAAACGGAGCAAAAUAU'
+
'AAAAGAUUUUGAGACUUCUGAUACAUUUUUUCAGACUGCAAGUGGGAAAAAUAUUAGUGUCGCCAAAGAGUCAUUUAAUAAAAUUGUAAAUUUCUUUGAUCAGAAACCAGAAGAAUUGCAUAACUUUUCCUUAAAUUCUGAAUUACAUUCUGACAUAAGAAAGAACAAAAUGGACAUUCUAAGUUAUGAGGAAACAGACAUAGUUAAACACAAAAUACUGAAAGAAAGUGUCCCAGUUGGUACUGGAAAUCAACUAGUGACCUUCCAGGGACAACCCGAACGUGAUGAAAAGAUCAAAGAACCUACUCUAUUGGGUUUUCAUACAGCUAGCGGGAAAAAAGUUAAAAUUGCAAAGGAAUCUUUGGACAAAGUGAAAAACCUUUUUGAUGAAAAAGAGCAAGGUACUAGUGAAAUCACCAGUUUUAGCCAUCAAUGGGCAAAGACCCUAAAGUACAGAGAGGCCUGUAAAGACCUUGAAUUAGCAUGUGAGACCAUUGAGAUCACAGCUGCCCCAAAGUGUAAAGAAAUGCAGAAUUCUCUCAAUAAUGAUAAAAACCUUGUUUCUAUUGAGACUGUGGUGCCACCUAAGCUCUUAAGUGAUAAUUUAUGUAGACAAACUGAAAAUCUCAAAACAUCAAAAAGUAUCUUUUUGAAAGUUAAAGUACAUGAAAAUGUAGAAAAAGAAACAGCAAAAAGUCCUGCAACUUGUUACACAAAUCAGUCCCCUUAUUCAGUCAUUGAAAAUUCAGCCUUAGCUUUUUACACAAGUUGUAGUAGAAAAACUUCUGUGAGUCAGACUUCAUUACUUGAAGCAAAAAAAUGGCUUAGAGAAGGAAUAUUUGAUGGUCAACCAGAAAGAAUAAAUACUGCAGAUUAUGUAGGAAAUUAUUUGUAUGAAAAUAAUUCAAACAGUACUAUAGCUGAAAAUGACAAAAAUCAUCUCUCCGAAAAACAAGAUACUUAUUUAAGUAACAGUAGCAUGUCUAACAGCUAUUCCUACCAUUCUGAUGAGGUAUAUAAUGAUUCAGGAUAUCUCUCAAAAAAUAAACUUGAUUCUGGUAUUGAGCCAGUAUUGAAGAAUGUUGAAGAUCAAAAAAACACUAGUUUUUCCAAAGUAAUAUCCAAUGUAAAAGAUGCAAAUGCAUACCCACAAACUGUAAAUGAAGAUAUUUGCGUUGAGGAACUUGUGACUAGCUCUUCACCCUGCAAAAAUAAAAAUGCAGCCAUUAAAUUGUCCAUAUCUAAUAGUAAUAAUUUUGAGGUAGGGCCACCUGCAUUUAGGAUAGCCAGUGGUAAAAUCGUUUGUGUUUCACAUGAAACAAUUAAAAAAGUGAAAGACAUAUUUACAGACAGUUUCAGUAAAGUAAUUAAGGAAAACAACGAGAAUAAAUCAAAAAUUUGCCAAACGAAAAUUAUGGCAGGUUGUUACGAGGCAUUGGAUGAUUCAGAGGAUAUUCUUCAUAACUCUCUAGAUAAUGAUGAAUGUAGCACGCAUUCACAUAAGGUUUUUGCUGACAUUCAGAGUGAAGAAAUUUUACAACAUAACCAAAAUAUGUCUGGAUUGGAGAAAGUUUCUAAAAUAUCACCUUGUGAUGUUAGUUUGGAAACUUCAGAUAUAUGUAAAUGUAGUAUAGGGAAGCUUCAUAAGUCAGUCUCAUCUGCAAAUACUUGUGGGAUUUUUAGCACAGCAAGUGGAAAAUCUGUCCAGGUAUCAGAUGCUUCAUUACAAAACGCAAGACAAGUGUUUUCUGAAAUAGAAGAUAGUACCAAGCAAGUCUUUUCCAAAGUAUUGUUUAAAAGUAACGAACAUUCAGACCAGCUCACAAGAGAAGAAAAUACUGCUAUACGUACUCCAGAACAUUUAAUAUCCCAAAAAGGCUUUUCAUAUAAUGUGGUAAAUUCAUCUGCUUUCUCUGGAUUUAGUACAGCAAGUGGAAAGCAAGUUUCCAUUUUAGAAAGUUCCUUACACAAAGUUAAGGGAGUGUUAGAGGAAUUUGAUUUAAUCAGAACUGAGCAUAGUCUUCACUAUUCACCUACGUCUAGACAAAAUGUAUCAAAAAUACUUCCUCGUGUUGAUAAGAGAAACCCAGAGCACUGUGUAAACUCAGAAAUGGAAAAAACCUGCAGUAAAGAAUUUAAAUUAUCAAAUAACUUAAAUGUUGAAGGUGGUUCUUCAGAAAAUAAUCACUCUAUUAAAGUUUCUCCAUAUCUCUCUCAAUUUCAACAAGACAAACAACAGUUGGUAUUAGGAACCAAAGUGUCACUUGUUGAGAACAUUCAUGUUUUGGGAAAAGAACAGGCUUCACCUAAAAACGUAAAAAUGGAAAUUGGUAAAACUGAAACUUUUUCUGAUGUUCCUGUGAAAACAAAUAUAGAAGUUUGUUCUACUUACUCCAAAGAUUCAGAAAACUACUUUGAAACAGAAGCAGUAGAAAUUGCUAAAGCUUUUAUGGAAGAUGAUGAACUGACAGAUUCUAAACUGCCAAGUCAUGCCACACAUUCUCUUUUUACAUGUCCCGAAAAUGAGGAAAUGGUUUUGUCAAAUUCAAGAAUUGGAAAAAGAAGAGGAGAGCCCCUUAUCUUAGUGGGAGAACCCUCAAUCAAAAGAAACUUAUUAAAUGAAUUUGACAGGAUAAUAGAAAAUCAAGAAAAAUCCUUAAAGGCUUCAAAAAGCACUCCAGAUGGCACAAUAAAAGAUCGAAGAUUGUUUAUGCAUCAUGUUUCUUUAGAGCCGAUUACCUGUGUACCCUUUCGCACAACUAAGGAACGUCAAGAGAUACAGAAUCCAAAUUUUACCGCACCUGGUCAAGAAUUUCUGUCUAAAUCUCAUUUGUAUGAACAUCUGACUUUGGAAAAAUCUUCAAGCAAUUUAGCAGUUUCAGGACAUCCAUUUUAUCAAGUUUCUGCUACAAGAAAUGAAAAAAUGAGACACUUGAUUACUACAGGCAGACCAACCAAAGUCUUUGUUCCACCUUUUAAAACUAAAUCACAUUUUCACAGAGUUGAACAGUGUGUUAGGAAUAUUAACUUGGAGGAAAACAGACAAAAGCAAAACAUUGAUGGACAUGGCUCUGAUGAUAGUAAAAAUAAGAUUAAUGACAAUGAGAUUCAUCAGUUUAACAAAAACAACUCCAAUCAAGCAGCAGCUGUAACUUUCACAAAGUGUGAAGAAGAACCUUUAGAUUUAAUUACAAGUCUUCAGAAUGCCAGAGAUAUACAGGAUAUGCGAAUUAAGAAGAAACAAAGGCAACGCGUCUUUCCACAGCCAGGCAGUCUGUAUCUUGCAAAAACAUCCACUCUGCCUCGAAUCUCUCUGAAAGCAGCAGUAGGAGGCCAAGUUCCCUCUGCGUGUUCUCAUAAACAGCUGUAUACGUAUGGCGUUUCUAAACAUUGCAUAAAAAUUAACAGCAAAAAUGCAGAGUCUUUUCAGUUUCACACUGAAGAUUAUUUUGGUAAGGAAAGUUUAUGGACUGGAAAAGGAAUACAGUUGGCUGAUGGUGGAUGGCUCAUACCCUCCAAUGAUGGAAAGGCUGGAAAAGAAGAAUUUUAUAGGGCUCUGUGUGACACUCCAGGUGUGGAUCCAAAGCUUAUUUCUAGAAUUUGGGUUUAUAAUCACUAUAGAUGGAUCAUAUGGAAACUGGCAGCUAUGGAAUGUGCCUUUCCUAAGGAAUUUGCUAAUAGAUGCCUAAGCCCAGAAAGGGUGCUUCUUCAACUAAAAUACAGAUAUGAUACGGAAAUUGAUAGAAGCAGAAGAUCGGCUAUAAAAAAGAUAAUGGAAAGGGAUGACACAGCUGCAAAAACACUUGUUCUCUGUGUUUCUGACAUAAUUUCAUUGAGCGCAAAUAUAUCUGAAACUUCUAGCAAUAAAACUAGUAGUGCAGAUACCCAAAAAGUGGCCAUUAUUGAACUUACAGAUGGGUGGUAUGCUGUUAAGGCCCAGUUAGAUCCUCCCCUCUUAGCUGUCUUAAAGAAUGGCAGACUGACAGUUGGUCAGAAGAUUAUUCUUCAUGGAGCAGAACUGGUGGGCUCUCCUGAUGCCUGUACACCUCUUGAAGCCCCAGAAUCUCUUAUGUUAAAGAUUUCUGCUAACAGUACUCGGCCUGCUCGCUGGUAUACCAAACUUGGAUUCUUUCCUGACCCUAGACCUUUUCCUCUGCCCUUAUCAUCGCUUUUCAGUGAUGGAGGAAAUGUUGGUUGUGUUGAUGUAAUUAUUCAAAGAGCAUACCCUAUACAGUGGAUGGAGAAGACAUCAUCUGGAUUAUACAUAUUUCGCAAUGAAAGAGAGGAAGAAAAGGAAGCAGCAAAAUAUGUGGAGGCCCAACAAAAGAGACUAGAAGCCUUAUUCACUAAAAUUCAGGAGGAAUUUGAAGAACAUGAAGAAAACACAACAAAACCAUAUUUACCAUCACGUGCACUAACAAGACAGCAAGUUCGUGCUUUGCAAGAUGGUGCAGAGCUUUAUGAAGCAGUGAAGAAUGCAGCAGACCCAGCUUACCUUGAGGGUUAUUUCAGUGAAGAGCAGUUAAGAGCCUUGAAUAAUCACAGGCAAA'
+
'UGUUGAAUGAUAAGAAACAAGCUCAGAUCCAGUUGGAAAUUAGGAAGGCCAUGGAAUCUGCUGAACAAAA'+
'GGAACAAGGUUUAUCAAGGGAUGUCACAACCGUGUGGAAGUUGCGUAUUGUAAGCUAUUCAAAAAAAGAA'+
'AAAGAUUCAGUUAUACUGAGUAUUUGGCGUCCAUCAUCAGAUUUAUAUUCUCUGUUAACAGAAGGAAAGA'+
'GAUACAGAAUUUAUCAUCUUGCAACUUCAAAAUCUAAAAGUAAAUCUGAAAGAGCUAACAUACAGUUAGC'+
'AGCGACAAAAAAAACUCAGUAUCAACAACUACCGGUUUCAGAUGAAAUUUUAUUUCAGAUUUACCAGCCA'+
'CGGGAGCCCCUUCACUUCAGCAAAUUUUUAGAUCCAGACUUUCAGCCAUCUUGUUCUGAGGUGGACCUAA'+
'UAGGAUUUGUCGUUUCUGUUGUGAAAAAAACAGGACUUGCCCCUUUCGUCUAUUUGUCAGACGAAUGUUA'+
'CAAUUUACUGGCAAUAAAGUUUUGGAUAGACCUUAAUGAGGACAUUAUUAAGCCUCAUAUGUUAAUUGCU'+
'GCAAGCAACCUCCAGUGGCGACCAGAAUCCAAAUCAGGCCUUCUUACUUUAUUUGCUGGAGAUUUUUCUG'+
'UGUUUUCUGCUAGUCCAAAAGAGGGCCACUUUCAAGAGACAUUCAACAAAAUGAAAAAUACUGUUGAGAA'+
'UAUUGACAUACUUUGCAAUGAAGCAGAAAACAAGCUUAUGCAUAUACUGCAUGCAAAUGAUCCCAAGUGG'+
'UCCACCCCAACUAAAGACUGUACUUCAGGGCCGUACACUGCUCAAAUCAUUCCUGGUACAGGAAACAAGC'+
'UUCUGAUGUCUUCUCCUAAUUGUGAGAUAUAUUAUCAAAGUCCUUUAUCACUUUGUAUGGCCAAAAGGAA'+
'GUCUGUUUCCACACCUGUCUCAGCCCAGAUGACUUCAAAGUCUUGUAAAGGGGAGAAAGAGAUUGAUGAC'+
'CAAAAGAACUGCAAAAAGAGAAGAGCCUUGGAUUUCUUGAGUAGACUGCCUUUACCUCCACCUGUUAGUC'+
'CCAUUUGUACAUUUGUUUCUCCGGCUGCACAGAAGGCAUUUCAGCCACCAAGGAGUUGUGGCACCAAAUA'+
'CGAAACACCCAUAAAGAAAAAAGAACUGAAUUCUCCUCAGAUGACUCCAUUUAAAAAAUUCAAUGAAAUU'+
'UCUCUUUUGGAAAGUAAUUCAAUAGCUGACGAAGAACUUGCAUUGAUAAAUACCCAAGCUCUUUUGUCUG'+
'GUUCAACAGGAGAAAAACAAUUUAUAUCUGUCAGUGAAUCCACUAGGACUGCUCCCACCAGUUCAGAAGA'+
'UUAUCUCAGACUGAAACGACGUUGUACUACAUCUCUGAUCAAAGAACAGGAGAGUUCCCAGGCCAGUACG'+
'GAAGAAUGUGAGAAAAAUAAGCAGGACACAAUUACAACUAAAAAAUAUAUCUAAGCAUUUGCAAAGGCGA'+
'CAAUAAAUUAUUGACGCUUAACCUUUCCAGUUUAUAAGACUGGAAUAUAAUUUCAAACCACACAUUAGUA'+
'CUUAUGUUGCACAAUGAGAAAAGAAAUUAGUUUCAAAUUUACCUCAGCGUUUGUGUAUCGGGCAAAAAUC'+
'GUUUUGCCCGAUUCCGUAUUGGUAUACUUUUGCUUCAGUUGCAUAUCUUAAAACUAAAUGUAAUUUAUUA'+
'ACUAAUCAAGAAAAACAUCUUUGGCUGAGCUCGGUGGCUCAUGCCUGUAAUCCCAACACUUUGAGAAGCU'+
'GAGGUGGGAGGAGUGCUUGAGGCCAGGAGUUCAAGACCAGCCUGGGCAACAUAGGGAGACCCCCAUCUUU'+
'ACAAAGAAAAAAAAAAGGGGAAAAGAAAAUCUUUUAAAUCUUUGGAUUUGAUCACUACAAGUAUUAUUUU'+
'ACAAGUGAAAUAAACAUACCAUUUUCUUUUAGAUUGUGUCAUUAAAUGGAAUGAGGUCUCUUAGUACAGU'+
'UAUUUUGAUGCAGAUAAUUCCUUUUAGUUUAGCUACUAUUUUAGGGGAUUUUUUUUAGAGGUAACUCACU'+
'AUGAAAUAGUUCUCCUUAAUGCAAAUAUGUUGGUUCUGCUAUAGUUCCAUCCUGUUCAAAAGUCAGGAUG'+
'AAUAUGAAGAGUGGUGUUUCCUUUUGAGCAAUUCUUCAUCCUUAAGUCAGCAUGAUUAUAAGAAAAAUAG'+
'AACCCUCAGUGUAACUCUAAUUCCUUUUUACUAUUCCAGUGUGAUCUCUGAAAUUAAAUUACUUCAACUA'+
'AAAAUUCAAAUACUUUAAAUCAGAAGAUUUCAUAGUUAAUUUAUUUUUUUUUUCAACAAAAUGGUCAUCC'+
'AAACUCAAACUUGAGAAAAUAUCUUGCUUUCAAAUUGGCACUGAUU';
var long = 'GUGGCGCGAGCUUCUGAAACUAGGCGGCAGAGGCGGAGCCGCUGUGGCACUGCUGCGCCUCUGCUGCGCCUCGGGUGUCUUUUGCGGCGGUGGGUCGCCGCCGGGAGAAGCGUGAGGGGACAGAUUUGUGACCGGCGCGGUUUUUGUCAGCUUACUCCGGCCAAAAAAGAACUGCACCUCUGGAGCGGACUUAUUUACCAAGCAUUGGAGGAAUAUCGUAGGUAAAAAUGCCUAUUGGAUCCAAAGAGAGGCCAACAUUUUUUGAAAUUUUUAAGACACGCUGCAACAAAGCAGAUUUAGGACCAAUAAGUCUUAAUUGGUUUGAAGAACUUUCUUCAGAAGCUCCACCCUAUAAUUCUGAACCUGCAGAAGAAUCUGAACAUAAAAACAACAAUUACGAACCAAACCUAUUUAAAACUCCACAAAGGAAACCAUCUUAUAAUCAGCUGGCUUCAACUCCAAUAAUAUUCAAAGAGCAAGGGCUGACUCUGCCGCUGUACCAAUCUCCUGUAAAAGAAUUAGAUAAAUUCAAAUUAGACUUAGGAAGGAAUGUUCCCAAUAGUAGACAUAAAAGUCUUCGCACAGUGAAAACUAAAAUGGAUCAAGCAGAUGAUGUUUCCUGUCCACUUCUAAAUUCUUGUCUUAGUGAAAGUCCUGUUGUUCUACAAUGUACACAUGUAACACCACAAAGAGAUAAGUCAGUGGUAUGUGGGAGUUUGUUUCAUACACCAAAGUUUGUGAAGGGUCGUCAGACACCAAAACAUAUUUCUGAAAGUCUAGGAGCUGAGGUGGAUCCUGAUAUGUCUUGGUCAAGUUCUUUAGCUACACCACCCACCCUUAGUUCUACUGUGCUCAUAGUCAGAAAUGAAGAAGCAUCUGAAACUGUAUUUCCUCAUGAUACUACUGCUAAUGUGAAAAGCUAUUUUUCCAAUCAUGAUGAAAGUCUGAAGAAAAAUGAUAGAUUUAUCGCUUCUGUGACAGACAGUGAAAACACAAAUCAAAGAGAAGCUGCAAGUCAUGGAUUUGGAAAAACAUCAGGGAAUUCAUUUAAAGUAAAUAGCUGCAAAGACCACAUUGGAAAGUCAAUGCCAAAUGUCCUAGAAGAUGAAGUAUAUGAAACAGUUGUAGAUACCUCUGAAGAAGAUAGUUUUUCAUUAUGUUUUUCUAAAUGUAGAACAAAAAAUCUACAAAAAGUAAGAACUAGCAAGACUAGGAAAAAAAUUUUCCAUGAAGCAAACGCUGAUGAAUGUGAAAAAUCUAAAAACCAAGUGAAAGAAAAAUACUCAUUUGUAUCUGAAGUGGAACCAAAUGAUACUGAUCCAUUAGAUUCAAAUGUAGCAAAUCAGAAGCCCUUUGAGAGUGGAAGUGACAAAAUCUCCAAGGAAGUUGUACCGUCUUUGGCCUGUGAAUGGUCUCAACUAACCCUUUCAGGUCUAAAUGGAGCCCAGAUGGAGAAAAUACCCCUAUUGCAUAUUUCUUCAUGUGACCAAAAUAUUUCAGAAAAAGACCUAUUAGACACAGAGAACAAAAGAAAGAAAGAUUUUCUUACUUCAGAGAAUUCUUUGCCACGUAUUUCUAGCCUACCAAAAUCAGAGAAGCCAUUAAAUGAGGAAACAGUGGUAAAUAAGAGAGAUGAAGAGCAGCAUCUUGAAUCUCAUACAGACUGCAUUCUUGCAGUAA';
var short = 'GUACGUAUGCAUCGACUAGUCAGCAGAUCGUACUGAUGCUAGCUAGCUAGCUAGAGAUGAGUACGCCGAGAGUAGGUCGUGCUAGCGCGCGAGAGAGU';

var M73307 = 
"TTTGAGGTCAAGCCAGAGAAGAGGTGGCAACACATCAGCATGATGCATGTGAAGATCATCAGGGAGCACA\
TCTTGGCCCACATCCAACACGAGGTCGACTTCCTCTTCTGCATGGATGTAGACCAGGTCTTCCAAGACAA\
TTTTGGGGTGGACACCCTAGGCCAGTCAGTGGATCAGCTACAGCCCTGGTGGTACAAGGCAGATCCTGAG\
GACTTTACCTAGGAAAGGCAGAAAGAGTCAGCAGCATGCATTCCATTTGGCCAGGGGGATTTTTATTACC\
ACACAGCCATGTTTGGAGGAACACCCATTCAGGTTCTCAACATCCCCCAGGAGTGCTTTAAAGGAATCCT\
CCTGGAAAAGAAAAATGACAT";

var testSeq = 
"TTAAATTCTAATTAGAGATGCAGGAATCAATGATAGGGAGGTTGGACAGCTCAGTTCCCCAGTGCCAGCCCAATAGACGGATGAGTTATTGTCATGTAAAAAGCGCCAGCAATAAGACCAACCGCTTTGCTATTGTCCAAGTGGAAAGAGCCAAGTTTATTATGAGGACTATATGCTCTAGAGACCTCAGACAAGGCATCTCATAGGAGGCTTTTTCATAAAACTAGGCTCTGCTGGTAGTAAGGAGGCCAGTTTGGAGGCAGGCGTTGAGCTGTGCACATCTCCCCACTCCAGCCACCTTCTCCATATCCATCTTTTATTTCATTTTTCCACTTGGCTGAGCCATCCAGAACCTTTTCAATGTATAAAATGGAATATTCTTACCTCAATTCCTCTGCCTACGA";

var testSeq1 =
"GCTCTTTCCCCGTGACACCCGACGCTGGGGGCGTGGCTGCCGGGAGGGGCCGCGGATGGGCGGGCCTACTTGGTCTCCCGCCCCCCCCCCCCCCCCCCGAACCGCCCCGCCGGCTTTGCCCCCCTTTGATCCCCTGCTACCCCCAACCCGTGCTGGTGGTGCGGGTTGGGGGGGGATGTGGGCGGGGGTGCGCGGGAGGTGTCGGTGGTGGTGGTGGTGGTGGTAGTAGGAATGGTGGTGAGGGGGGGGGGGCGCTGGTTGGTCAAAAAAGGGAGGGACGGGGGCCGGCAGACCGACGGCGACAACGCTCCCCGGCGGCCGGGTCGCGGCTCTTACGAGCGGCCCGGCCCGCGCTCCCACCCCCCGGGCCGTGTCCTTGCTTTCCCCCCGTCTCCCCCCCCCCCGCCTTCTCCTCCTCCTCCTCGTTTTTCCAAACCCCGCCCACCCGGCCCGGCCCGGCCCGGCCCGGCCCGGCCACCGCCGCCCACCCACCCACCTCGGGATACCCAGCCCCGGTCCCCCGTTCCCCGGGGGCCGTTATCTCCAGCGCCCCGTCCGGCGCGCCGCCCCCCGCCGCTAAACCCCATCCCGCCCCCGGGACCCCACATATAAGCCCCCAGCCACACGCAAGAACAGACACGCAGAACGGCTGTGTTTATTTAAATAAACCAATGTCGGAATAAACAAACACAAACACCCGCGACGGGGGGACGGAGGGGACGGAGGGAGGGGGTGACGGGGGACGGGAACAGACACAAAAACAACCACAAAAAACAACCACCCACCGACACCCCCACCCCAGTCTCCTCGCCTTCTCCCACCCACCCCACGCCCCCACTGAGCCCGGTCGATCGACGAGCACCCCCGCCCACGCCCCCGCCCCTGCCCCGGCGACCCCCGGCCCGCACGATCCCGACAACAATAACAACCCCAACGGAAAGCGGCGGGGTGTTGGGGGAGGCGAGGAACAACCGAGGGGAACGGGGGATGGAAGGACGGGAAGTGGAAGTCCTGATACCCATCCTACACCCCCCTGCCTTCCACCCTCCGGCCCCCCGCGAGTCCACCCGCCGGCCGGCTACCGAGACCGAACACGGCGGCCGCCGCAGCCGCCGCAGCCGCCGCCGACACCGCAGAGCCGGCGCGCGCACTCACAAGCGGCAGAGGCAGAAAGGCCCAGAGTCATTGTTTATGTGGCCGCGGGCCAGCAGACGGCCCGCGACACCCCCCCCCCGCCCGTGTGGGTATCCGGCCCCCCGCCCCGCGCCGGTCCATTAAGGGCGCGCGTGCCCGCGAGATATCAATCCGTTAAGTGCTCTGCAGACAGGGGCACCGCGCCCGGAAATCCATTAGGCCGCAGACGAGGAAAATAAAATTACATCACCTACCCACGTGGTGCTGTGGCCTGTTTTTGCTGCGTCATCTCAGCCTTTATAAAAGCGGGGGCGCGGCCGTGCCGATCGCGGGTGGTGCGAAAGACTTTCCGGGCGCGTCCGGGTGCCGCGGCTCTCCGGGCCCCCCTGCAGCCGGGGCGGCCAAGGGGCGTCGGCGACATCCTCCCCCTAAGCGCCGGCCGGCCGCTGGTCTGTTTTTTCGTTTTCCCCGTTTCGGGGGTGGTGGGGGTTGCGGTTTCTGTTTCTTTAACCCGTCTGGGGTGTTTTTCGTTCCGTCGCCGGAATGTTTCGTTCGTCTGTCCCCTC"

var request = new Request
(
    //  M73307,
    testSeq1,
    ' ', //Accesion number
    { //Preferences
        'tempEnv' :37,
        'naEnv' : 150, //mM
        'mgEnv' : 0, //mM
        'oligoEnv': 12,
        'cutsites' : ['GUC', 'UUC'],
        'ribozymeSelection': 'hammerHead-Rz',
        'left_arm_min': 5,
        'right_arm_min': 5,
        'left_arm_max':10,
        'right_arm_max':10,
        'promoter': '',
        'specificity':false
    },
    'Test', //ID
    'mouse (taxid:10090)', //organism such as = mouse (taxid:10090)
    function (request) { //callback 
        console.log('State: ' + request.Part + ';' + request.PartProgress + '%');
        if (request.Part == 8)
            console.log(request.State);
    });
   

//var request = new Request
//(
//    'AUUGUACGCGUCGCACGAUGCAUGCUC',
//    ' ', //Accesion number (who cares!)
//    { //Preferences
//        'tempEnv': 37,
//        'naEnv': 150, //mM
//        'mgEnv': 0, //mM
//        'oligoEnv': 0,
//        'cutsites': ['GUC'],
//        'left_arm_min': 3,
//        'right_arm_min': 3,
//        'left_arm_max': 8,
//        'right_arm_max': 8

//    },
//    'Test', //ID
//    0,//CoreType
//    '', //organism such as = mouse (taxid:10090)
//    function (request) //callback
//    {

//        console.log('State: ' + request.Part + ';' + request.PartProgress + '%');
//        if (request.Part == 7)
//            console.log(request.State);
//    }//Promoter : Disabled due to change in algorithm sequence (e.g. non-annealing ones are removed earlier on)
//    );



TestObj.HandleRequestPart1(request);
console.log('DONE');

