import numpy as np  # Biblioteca necessária para operações matriciais e cálculo de determinantes

def calcular_area_triangulo(x1, y1, x2, y2, x3, y3):
    """
    Calcula a área de um triângulo dado as coordenadas dos seus vértices (x,y).
    Utiliza a fórmula baseada no determinante: Área = |det(A)| / 2,
    onde A é uma matriz 3x3 composta pelas coordenadas dos vértices e uma coluna de uns.
    """
    matriz = np.array([
        [x1, y1, 1],
        [x2, y2, 1],
        [x3, y3, 1]
    ])
    # np.linalg.det calcula o determinante da matriz
    # abs() garante que o valor da área seja positivo
    area = abs(np.linalg.det(matriz)) / 2
    return area

def main():
    """
    Função principal que gerencia o fluxo de entrada do usuário,
    chama a função de cálculo de área e acumula os resultados.
    """
    try:
        # Pede o número de triângulos para iterar o processo
        num_triangulos = int(input("Digite o número de triângulos: "))
        area_total = 0.0

        for i in range(num_triangulos):
            print(f"\nTriângulo {i + 1}:")
            # Coleta as coordenadas (vértices) de cada triângulo
            x1 = float(input("x1: "))
            y1 = float(input("y1: "))
            x2 = float(input("x2: "))
            y2 = float(input("y2: "))
            x3 = float(input("x3: "))
            y3 = float(input("y3: "))

            # Chama a função de cálculo e soma à área total
            area = calcular_area_triangulo(x1, y1, x2, y2, x3, y3)
            area_total += area
            print(f"Área do triângulo {i + 1}: {area:.2f}")

        # Exibe o resultado final acumulado
        print(f"\nÁrea total dos {num_triangulos} triângulos: {area_total:.2f}")

    except ValueError:
        print("Erro: Entrada inválida. Certifique-se de inserir números.")

# Conexão do código:
# O bloco 'if __name__ == "__main__":' garante que a execução comece pela função 'main()'.
# A 'main' orquestra a interação com o usuário e reutiliza a função 'calcular_area_triangulo'
# para cada entrada de triângulo, garantindo um código modular e organizado.
if __name__ == "__main__":
    main()
