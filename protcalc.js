if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex, j = this.length; i < j; i++) {
            if (this[i] === obj)
                return i;
        }
        return -1;
    };
}

function sequence(header, sequence){
	this.sequence = String(sequence);
	this.header = String(header);
};

function Codon(codes, letter, name, mass){
	this.codes = codes;
	this.letter = letter;
	this.name = name;
	this.mass = mass;
};
/*
function isolateSubSequences (text){
	//var header = /^>.?\|* /i;
	var Seqs= [];
	var lm = 0;
	for (var i=0; i<text.length; i++){
		if (text[i].search(header) != -1){
			console.log("Matched a header at position ", i, ". Last match at ", lm)
			if (lm==0 && i==0){
				continue
			}else{
				Seqs.push(sequence(text[i], text.slice(lm, i-1).join()))
				lm = i
			}			
		};
	};
	if (lm==0){
		Seqs.push(sequence("", text));	
	};
	return Seqs
};

// function parseSequence (Seq){
	console.log(Seq, typeof(Seq))
	// Search for non-DNA FASTA characters
	var results = ['DNA', 'Protein'];
	var result;
	var isDNA = Seq.sequence.search(/[ACGTU]/gi);
	var isProtein = Seq.sequence.search(/[EFILMPQZX/*]/gi);
	console.log("Is DNA:",isDNA,"Is Protein:",isProtein);
	switch(isDNA){
		case -1:
			if (isProtein>-1){
				result = 1
				console.log("Is neither DNA not protein. Reset to protein. Wait, what? Have user specify.");
				}
			else{result = 1};
		default:
			result = 0
	};
		// debug
		console.log("Auto-detected sequence type for {0}: {1}".format(Seq.header, results[result]));
		// translate if needed
		if (result==0){
			console.log("Translating {0} to protein. Please stand by...".format(Seq.header))
			Seq.dnaSeq = Seq.sequence
			// Seq.protSeq = translateToProtein(Seq.dnaSeq);
		}else{
			Seq.protSeq = Seq.sequence
		};
		// count number of residues
		// calculate mass
		// calculate coefficient
		// absorbances
			// Wait how do I get absorbances PER sequence
};	
*/

var waterMass = 18.01528

var codons = [
	new Codon(['GCU', 'GCC', 'GCA', 'GCG'], 				'A', 'Alanine', 71.0788), 
	new Codon(['UGU', 'UGC'], 								'C', 'Cysteine', 103.00919), 
	new Codon(['GAU', 'GAC'], 								'D', 'Aspartate', 115.02694), 
	new Codon(['GAA', 'GAG'], 								'E', 'Glutamic Acid', 129.04259), 
	new Codon(['UUU', 'UUC'], 								'F', 'Phenylalanine', 147.06841), 
	new Codon(['GGU', 'GGC', 'GGA', 'GGG'], 				'G', 'Glycine', 57.02146), 
	new Codon(['CAU', 'CAC'], 								'H', 'Histidine', 137.05891), 
	new Codon(['AUU', 'AUC', 'AUA'], 						'I', 'Isoleucine', 113.08406), 
	new Codon(['AAA', 'AAG'], 								'K', 'Lysine', 128.09496), 
	new Codon(['UUA', 'UUG', 'CUU', 'CUC', 'CUA', 'CUG'], 	'L', 'Leucine', 113.08406), 
	new Codon(['AUG'], 										'M', 'Methionine', 131.04049), 
	new Codon(['AAU', 'AAC'], 								'N', 'Asparagine', 114.04293), 
	new Codon(['CCU', 'CCC', 'CCA', 'CCG'], 				'P', 'Proline', 97.05276), 
	new Codon(['CAA', 'CAG'], 								'Q', 'Glutamine', 128.05858), 
	new Codon(['AGA', 'AGG', 'CGU', 'CGC', 'CGA', 'CGG'], 	'R', 'Arginine', 156.10111), 
	new Codon(['UCU', 'UCC', 'UCA', 'UCG', 'AGU', 'AGC'], 	'S', 'Serine', 87.03203), 
	new Codon(['ACU', 'ACC', 'ACA', 'ACG'], 				'T', 'Threonine', 101.04768), 
	new Codon(['GUU', 'GUC', 'GUA', 'GUG'], 				'V', 'Valine', 99.06841), 
	new Codon(['UGG'], 										'W', 'Tryptophan', 186.07931), 
	new Codon(['UAU', 'UAC'], 								'Y', 'Tyrosine', 163.06333), 
	new Codon(['UAA', 'UAG', 'UGA'], 						'', 'STOP', 0), 
	new Codon(['XXX'], 										'B', 'Aspartate/Asparagine', 114.6068474), 
	new Codon(['SSS'], 										'X', 'Any', 110.92618464),
	new Codon(['DDD'], 										'Z', 'Glutamate/Glutamine', 128.6804964)];
	
//codons = codons.reduce( function (hash,c){ return c.codes.reduce( function (hash,triplet){ hash[triplet] = c; return hash }, hash)}, {})
	
function tokenizeDNASequence (dnaSeq){
	//translate to RNA
	dnaSeq = dnaSeq.replace(/T/gi, "U")
	dnaSeq = dnaSeq.substring(0, (Math.floor(dnaSeq.length / 3) * 3))
	tokenizedSequence = dnaSeq.split(/(?=(?:...)*$)/)
	// function to look up a codon given a string triplet
	function tripletToCodon(triplet) {
		matchedCodons = codons.filter( function(c){return (c.codes.indexOf(triplet) != -1)} )
		if (matchedCodons.length > 0){
			return matchedCodons[0]
		}else{
			// if lookup fails, return a "null" Codon
			return new Codon([],'','',0)
		}
	}
	// turn array of triplets into array of codons
	codonSequence = tokenizedSequence.map(tripletToCodon)
	// get string of protein sequence, including starts and stops
	proteinSequence = codonSequence.map( function(c){ return c.letter} ).join("")
	// get molecular mass
	//subtract a Water for every peptide bond?
	mass = codonSequence.reduce( function(totalMass, c){ return totalMass + c.mass}, 0)
	console.log(codonSequence, proteinSequence, mass)
};

function calculateAbsorbance (Seq, i){
	
};

function parseInput (form) {
	//Parse header/FASTA bullshit
	var header = /^>.?\|*/i;
	var sheader = "Unnamed Sequence"
	//normalize linebreaks and make into an array:
	var rawSeq = form.seqbox.value.replace(/\r\n/g, "\n").split("\n");
	//var Seq = isolateSubSequences(rawSeq)
	if (rawSeq[0].search(header)!=-1){
		sheader = rawSeq.slice(0, 1).join("");
		rawSeq = rawSeq.slice(1, rawSeq.length+1).join("");
	};
	Seq = new sequence(sheader, rawSeq.join(""));
	var rawSeqType;
	if (form.FASTAtype[0].checked){
		rawSeqType = "Protein"
	}else{
		rawSeqType = "DNA";
	}
	tokenizeDNASequence(Seq.sequence);
};
	
/*
----
var conc = document.form.A.value / ( document.form.e.value * document.form.d.value ) * 1000000;
var mconc = document.form.A.value / ( document.form.e.value * document.form.d.value ) * document.form.M.value;
document.form.concentration.value = conc;
document.form.mconcentration.value = mconc;

----
It has been shown that it is possible to estimate the molar extinction coefficient of a protein from knowledge of its amino acid composition. From the molar extinction coefficient of tyrosine, tryptophan and cystine (cysteine does not absorb appreciably at wavelengths >260 nm, while cystine does) at a given wavelength, the extinction coefficient of the native protein in water can be computed using the following equation:

E(Prot) = Numb(Tyr)*Ext(Tyr) + Numb(Trp)*Ext(Trp) + Numb(Cystine)*Ext(Cystine)
where (for proteins in water measured at 280 nm): Ext(Tyr) = 1490, Ext(Trp) = 5500, Ext(Cystine) = 125;
The absorbance (optical density) can be calculated using the following formula:
Absorb(Prot) = E(Prot) / Molecular_weight
http://www.ncbi.nlm.nih.gov/pubmed/8563639?dopt=Abstract
http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2143013/
----   

	Letter	Amino Acid		Average Mass	% of all residues
	A		alanine			071.0788		8.25
	R		arginine		156.10111		5.53
	N		asparagine		114.04293		4.06
	D		aspartate		115.02694		5.45
	C		cystine			103.00919		1.37
	E		glutamate		129.04259		6.75
	Q		glutamine		128.05858		3.93
	G		glycine			057.02146		7.07
	H		histidine		137.05891		2.27
	I		isoleucine		113.08406		5.95
	L		leucine			113.08406		9.66
	K		lysine			128.09496		5.84
	M		methionine		131.04049		2.42
	F		phenylalanine	147.06841		3.86
	P		proline			097.05276		4.70
	S		serine			087.03203		6.57
	T		threonine		101.04768		5.34
	W		tryptophan		186.07931		1.08
	Y		tyrosine		163.06333		2.92
	V		valine			099.06841		6.87
	U		selenocysteine	150.956363		N/A
	Source: http://web.expasy.org/findmod/findmod_masses.html#AA

	Uncommon codons
	B	aspartate/asparagine 	114,6068474
	Z	glutamate/glutamine		128,6804964
	X	any						110,92618464
						
	These codons are handled as ExPASY's comput_pi (http://web.expasy.org/compute_pi/pi_tool-doc.html) does. Their masses were calculated from ExPASY statistics (http://web.expasy.org/docs/relnotes/relstat.html) on 11th December 2013
	Amino Acid	Letter	Average Mass	% of all residues
	aspartate	D		115.02694		5.45
	asparagine	N		114.04293		4.06
	

	glutamate	E		129.04259		6.75
	glutamine	Q		128.05858		3.93
*/
