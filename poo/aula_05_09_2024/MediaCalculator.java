public class MediaCalculator {
    public double nota1;
    public double nota2;
    public double media;

    public void result() {
        media = getMedia();
        System.out.println("Media: " + media);

        if (media > 7) {
            System.out.println("Aprovado!");
        } else if (media >= 4 && media < 7) {
            System.out.println("Recuperação");
        } else {
            System.out.println("Reprovado");
        }
    }

    public double getMedia() {
        media = (nota1 + nota2) / 2;

        return media;
    }
}
