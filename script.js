// Global variable to store the processed expression
let expression = '';

// Function to insert a value at the end of the input field
function insertValue(value) {
  const mathField = document.getElementById('function-input');
  mathField.value += value; // Append the value to the existing input
  mathField.focus();
}

// Function to set the input field value to a specific text
function setInputValue(value) {
  const mathField = document.getElementById('function-input');
  mathField.value = value; // Replace the entire input with the provided value
}

// Function to calculate the derivative
function calculateDerivative() {
  const mathField = document.getElementById('function-input');
  const input = mathField.value;

  try {
    // Convert LaTeX to Math.js compatible syntax
    expression = input
      .replace(/\\pi/g, 'pi')
      .replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)')
      .replace(/\\cdot/g, '*')
      .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
      .replace(/\\sin/g, 'sin')
      .replace(/\\cos/g, 'cos')
      .replace(/\\tan/g, 'tan')
      .replace(/\\sec/g, 'sec')
      .replace(/\\csc/g, 'csc')
      .replace(/\\cot/g, 'cot')
      // Replace \ln with log(argument)
      .replace(/\\ln/g, 'log($1)')
      .replace(/e\^\{([^}]*)\}/g, 'exp($1)')
      .replace(/ \-/g, '-') // Replace spaces with minus operator for subtraction
      .replace(/\^/g, '^'); // Replace ** with ^ for exponentiation

    // Use regex to group arithmetic expressions within parentheses
    expression = expression.replace(
      /(\w+|\([^()]+\))([\+\-\*\/])(\w+|\([^()]+\))/g,
      '($1 $2 $3)'
    );

    // Remove the ⁡ symbol
    expression = expression.replace(/⁡/g, '');

    // Calculate the derivative
    const derivative = math.derivative(expression, 'x').toString();

    // Display the derivative with MathJax formatting
    const output = document.getElementById('output');
    output.innerHTML = `$$\\frac{d}{dx}(${input}) = ${derivative}$$`;
    MathJax.typeset();
  } catch (error) {
    // Handle errors and provide specific feedback
    const output = document.getElementById('output');
    let errorMessage = `Erro na entrada. Por favor, digite uma função válida.<br>`;

    // Analyze the error message for common mistakes
    if (error.message.includes('Unexpected end of input')) {
      errorMessage += 'Verifique se a sua função está completa e se os parênteses estão balanceados.';
    } else if (error.message.includes('Unknown symbol')) {
      errorMessage += `Verifique se não há caracteres inválidos na sua função. Símbolo desconhecido: ${error.message.match(/Unknown symbol: (.*)/)[1]}.`;
    } else if (error.message.includes('BlockNode')) {
      errorMessage += 'Erro na subtração. Substitua os espaços entre os termos pelo sinal de menos (-).';
    } else {
      errorMessage += `Erro: ${error.message}`;
    }

    // Display the error message with input details
    output.innerHTML = errorMessage + `<br>
      <strong>Input LaTeX:</strong> ${input}<br>
      <strong>Input Processado:</strong> ${expression}<br>`;
  }
}

// Add click event listener to the "Derivar" button
document.getElementById('derive-button').addEventListener('click', calculateDerivative);
