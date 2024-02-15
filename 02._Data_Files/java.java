import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

class java {
    public static void main(String[] args) {
        ReadFile("me.json");
        ReadFile("me.csv");
        ReadFile("me.xml");
        ReadFile("me.yaml");
        ReadFile("me.txt");
    }

    public static void ReadFile(String path) {
        try {
            File myObj = new File("./02._Data_Files/" + path);
            Scanner myReader = new Scanner(myObj);
            while (myReader.hasNextLine()) {
                String data = myReader.nextLine();
                System.out.println(data);
            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }
}