import { stdout } from 'process';
import chalk from 'chalk';

/**
 * To start spinner: const stopSpinner = startSpinner();
 *
 */

export function startSpinner(loadingMsg) {
    const characters = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const cursorEsc = {
        hide: '\u001B[?25l',
        show: '\u001B[?25h',
    };
    stdout.write(cursorEsc.hide);

    let i = 0;
    const timer = setInterval(function () {
        stdout.write(
            `\r${chalk.cyan(
                characters[i++]
            )} FETCHING RESULTS FOR ${chalk.bgYellow.black(
                ` ${loadingMsg.toUpperCase()} `
            )}`
        );
        i = i >= characters.length ? 0 : i;
    }, 20);

    return () => {
        clearInterval(timer);
        stdout.write('\r');
        stdout.write(cursorEsc.show);
    };
}
