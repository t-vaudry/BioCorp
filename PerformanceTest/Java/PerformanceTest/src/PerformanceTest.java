import java.util.ArrayList;
import java.util.List;

public class PerformanceTest {

	public static void main(String[] args) {
		long startTime = System.currentTimeMillis();
		List<Thread> threadList = new ArrayList<Thread>();
		for(int i= 0; i < 200; i++){
			Sfold sfold = new Sfold(i);
	        Thread t = new Thread(sfold);
	        t.start();
	        threadList.add(t);
		}
		for(Thread t: threadList){
			try {
				t.join();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	    long time = System.currentTimeMillis() - startTime;
	    System.out.println("time:" + time/1000 + " secs");
	}	

}
