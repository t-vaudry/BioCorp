import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

public class Sfold implements Runnable {

	private int i;

	public Sfold(int i) {
		this.i = i;
	}

	public void run() {
		String fileLoc = "/home/mohiul/workspace-java/Test/";
		String testFolder = "testFolders/test" + i;
		String outputFolder = testFolder + "/output";
		String seqFile = testFolder + "/seq";
		try {
		    File dir = new File(testFolder);
		    dir.mkdir();
		    dir = new File(seqFile);
		    dir.createNewFile();
			PrintWriter out = new PrintWriter(new FileWriter(seqFile));
			out.println(">gi|395400|emb|X66515|ECTRALA E.coli tRNA-Ala\n" 
				    + "GGGGCTATAGCTCAGCTGGGAGAGCGCTTGCATGGCATGCAAGAGGTCAGCGGTTCGATCCCGCTTAGCTCCACCA");
			out.close();
		    dir = new File(outputFolder);
		    dir.mkdir();
		    String exec = "/home/mohiul/PhdResearch/Ribosoft/sfold-2.2/bin/sfold -o " + fileLoc + outputFolder + "/ " + fileLoc + seqFile;
//		    System.out.println("Executing: " + exec );
			Process p = Runtime.getRuntime().exec(exec);

			p.waitFor();
			BufferedReader buf = new BufferedReader(new InputStreamReader(p.getInputStream()));
			String line = "";
			String output = "";

			while ((line = buf.readLine()) != null) {
				output += line + "\n";
			}

			System.out.println(output);

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}