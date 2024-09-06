import java.util.Scanner;

public class ScannerStudy {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    MediaCalculator calcular = new MediaCalculator();

    System.out.println("Solicite a nota 1: ");
    calcular.nota1 = scanner.nextDouble();

    System.out.println("Solicite a nota 2: ");
    calcular.nota2 = scanner.nextDouble();

    calcular.result();
    System.out.println("Sua média: " + calcular.getMedia());

    scanner.close();
  }
}
