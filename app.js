/** The current input of the calculator. */
var input = "0";

/** Represents if a decimal is currently being used in the current num. */
var curr_decimal = false;

/** The valid key presses that can be used. */
var valid_keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                 "/", "*", "x", "-", "+", "=", "%",
                  "(", ")", "c", ".", "backspace", "enter"
                ];
            
/** Simplifies the expression stored in s (input).
 * evaluate has an inner function calc, which takes in an
 * index. calc has inner function update sign that updates
 * the stack based on the operator (sign) being applied. If
 * there are paranthesis in s (input), calc recursively simplifies the
 * paranthesis expressions. */
function evaluate(s) {
    var calc = function(i) {
        var num = 0;
        var stack = [];
        var sign = "+";
        var char;
        var decimal = "";
        /** Returns false if the function divides by zero. Else true.
         * Updates the stack that stores the evaluation of the current expression. */
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
                    alert("Error! Division By Zero!") //will reset the calculator back to zero
                    stack[stack.length - 1] = 0;
                    return false;
                }
            } 
            return true;
        }
        while (i < s.length) {
            char = s[i];
            /** This is here to have UI show the x instead of asterisk. */
            if (char == "×" || char == "x") {
                char = "*";
            }

            if (char === " ") {
                i += 1;
                continue;
            } else if (char == ".") {
                i+= 1;
                char = s[i];
                /** Adds the mantissa part of the floating point number. */
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
                num = parseFloat(parseFloat(num + "." + decimal).toFixed(10)); //new floating point number
                decimal = "";
                i -= 1;
            } else if (/^-?\d+$/.test(char)) { //if character is a digit
                num = num * 10 + parseInt(char);
            } else if (["+", "-", "/", "*"].includes(char)) {
                /** Manages the division by zero error. */
                if (!update(sign)) {
                    return 0;
                }
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
        return stack.reduce((acc, val) => acc + val, 0); //sum the stack
    }
    /** Check if result is a floating point. If so, leave
     * curr_decimal flag to true. */
    let result = calc(0).toString();
    if (!(result % 1 === 0)) { 
        curr_decimal = true; 
    } 
    return result;
};

/** Ensures there are no empty brackets and that the number of closed paranthesis
 * does not exceed the number of open paranthesis. Append closed paranthesis if 
 * the number of open paranthesis is greater than the number of closed paranthesis. */
function validate() {
    var operators = ["×", "/", "+", "-", "x", "*"];
    if (input.includes("()") || operators.includes(input.slice(-1))) {
        return false;
    }
    let num_open_paranthesis = input.split("(").length - 1;
    let num_close_paranthesis = input.split(")").length - 1;
    while (num_open_paranthesis > num_close_paranthesis) {
        input = input + ")";
        num_close_paranthesis += 1;
    }
    return num_open_paranthesis == num_close_paranthesis;
}

/**Updates the calculator display. Evalutes the expression if the equals
* button is pressed. */
function updateDisplay(entry) {
    var operators = ["×", "/", "+", "-", "%", "x", "*"];

    if (entry == "=" || entry == "enter") {
        if (!validate()) {
            return;
        }
        input = evaluate(input);
    } else if (entry == "backspace") {
        if (input.slice(-1) == ".") {
            curr_decimal = false;
        }
        input = input.slice(0, - 1);
        if (input.length == 0) {
            input = "0";
        }
    } else if (input.length > 25) {
        return;
    } else if (entry == "c") {
        input = "0";
    } else if (input.length == 1 && input == 0 && entry == "." && !curr_decimal) {
        input = input + "."
        curr_decimal = true;
    } else if (input.length == 1  && input != "(" && input == 0) {
        if (entry == "-" || !operators.includes(entry)) {
            input = entry;
        }
    } else if (operators.includes(entry) && operators.includes(input.slice(-1))) {
            return; /** Only one operator can be used at a time. One operator cannot be followed by another operator. */
    } else if (entry == "." && curr_decimal) {
            return;
    } else if (entry == ".") {
        input += entry;
        curr_decimal = true;
    } else if (entry == "(" && !operators.includes(input.slice(-1))) {
        input = input + "x" + entry;
    } else {
        if (operators.includes(entry) && entry != "%") {
            curr_decimal = false;
        }
        input = input + `${entry}`;
    }
    document.getElementById("input").innerHTML = input;
}

/** An event listener to support button click input. */
var userSelection = document.getElementsByClassName("entry");
for (let i = 0; i < userSelection.length; i++) {
    userSelection[i].addEventListener("click", () => (updateDisplay(userSelection[i].id)));
}

/** An event listener to support keyboard input. Must be a valid key. */
document.addEventListener('keydown', (e) => {
    if (valid_keys.includes(e.key.toLowerCase())) {
        if (e.key == "*") {
            updateDisplay("×");
        } else {
            updateDisplay(e.key.toLowerCase());
        }
    }
});
