/** The current input of the calculator. */
var input = "0";

/** Represents if a decimal is currently being used in the current num. */
var curr_decimal = false;

/** The valid key presses that can be used. */
var valid_keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                 "/", "*", "x", "-", "+", "=", "%",
                  "(", ")", "c", ".", "backspace", "enter"];
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    return operator(a, b);
}

/** Simplifies the expression in input. */
function evaluate(s) {
    var calc = function(i) {
        var num = 0;
        var stack = [];
        var sign = "+";
        var char;
        var decimal = "";
        function update(sign) {
            if (sign == "+") {
                stack.push(num);
            } else if (sign == "-") {
                stack.push(-num);
            } else if (sign == "*") {
                stack[stack.length - 1] = stack[stack.length - 1] * num;
            } else if (sign == "/") {
                if (num != 0) {
                    stack[stack.length - 1] = stack[stack.length - 1] / num;
                } else {
                    alert("Error! Division By Zero!")
                    stack[stack.length - 1] = 0;
                }
            } 
        }
        while (i < s.length) {
            char = s[i];
            /** This is here to have UI show the x instead of asterisk. */
            if (char == "×") {
                char = "*";
            }

            if (char === " ") {
                i += 1;
                continue;
            } else if (char == ".") {
                i+= 1;
                char = s[i];
                while ((i < s.length && /^-?\d+$/.test(char)) || char === " ") {
                    if (char == " ") {
                        i += 1;
                        char = s[i];
                    } else {
                        decimal = decimal + char;
                        i += 1;
                        char = s[i];
                    }
                }
                num = parseFloat(parseFloat(num + "." + decimal).toFixed(10));
                decimal = "";
                i -= 1;
            } else if (/^-?\d+$/.test(char)) {
                num = num * 10 + parseInt(char);
            } else if (["+", "-", "/", "*"].includes(char)) {
                update(sign);
                sign = char;
                num = 0;
            } else if (char == "%") {
                stack.push(num /100);
                num = 0;
            } else if (char === "(") {
                inner_value = calc(i + 1);
                num = inner_value[0];
                i = inner_value[1] - 1;
            } else if (char === ")") {
                update(sign);
                summation = stack.reduce((acc, val) => acc + val, 0);
                return [summation, i + 1];
            }
            i++;
        }
        update(sign);
        return stack.reduce((acc, val) => acc + val, 0);
    }
    return calc(0).toString();
};

/**Updates the calculator display. Evalutes the expression if the equals
* button is pressed. */
function updateDisplay(entry) {
    var operators = ["×", "/", "+", "-", "%"];

    if (entry == "=" || entry == "enter") {
        input = evaluate(input);
        curr_decimal = false;
    } else if (entry == "backspace") {
        input = input.slice(0, - 1);
        if (input.length == 0) {
            input = "0";
        }
    } else if (input.length > 25) {
        return;
    } else if (entry == "c") {
        input = "0";
    } else if (input.slice(-1) == 0 && entry == "." && !curr_decimal) {
        input = input + "."
        curr_decimal = true;
    } else if (input == 0 && input.slice(-1) != ".") {
        input = entry;
    } else if (operators.includes(entry) && operators.includes(input.slice(-1))) {
            return; /** Only one operator can be used at a time. One operator cannot be followed by another operator. */
    } else if (entry == "." && curr_decimal) {
            return;
    } else {
        if (operators.includes(entry) && entry != "%") {
            curr_decimal = false;
        }
        input = input + `${entry}`;
    }

    document.getElementById("input").innerHTML = input;
}


var userSelection = document.getElementsByClassName("entry");
for (let i = 0; i < userSelection.length; i++) {
    userSelection[i].addEventListener("click", () => (updateDisplay(userSelection[i].id)));
}
document.addEventListener('keydown', (e) => {
    if (valid_keys.includes(e.key.toLowerCase())) {
        updateDisplay(e.key.toLowerCase());
    }
}
);