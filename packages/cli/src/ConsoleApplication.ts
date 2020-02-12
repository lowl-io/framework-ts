import { CommandInterface } from './AbstractCommand';
import { HelpCommand } from './HelpCommand';

export class ConsoleApplication {
    protected commands: Record<string, CommandInterface> = {};

    public constructor() {
        this.addCommand(
            new HelpCommand(this.commands),
        )
    }

    public addCommand(command: CommandInterface): void {
        if (command.name) {
            this.commands[command.name] = command;
        } else {
            throw new Error(
                `Please specify name for command: "${command.constructor.name}"`
            )
        }
    }

    public addCommands(commands: CommandInterface[]): void {
        for (const command of commands) {
            this.addCommand(command);
        }
    }

    public async execute(): Promise<void> {
        const argv = process.argv.slice(2);

        if (argv[0]) {
            if (argv[0] in this.commands) {
                const command: CommandInterface<unknown, unknown> = this.commands[argv[0]];
                const argvs = argv.splice(1);

                let resultArguments: {[key: string]: any} = {};
                let resultOptions: {[key: string]: any} = {};

                let index = 0;

                for (const [argumentName, argumentSchema] of Object.entries(command.arguments)) {
                    if (index in argvs) {
                        resultArguments[argumentName] = argvs[index];
                    } else {
                        if (argumentSchema.required) {
                            throw new Error(
                                `Argument is required`,
                            )
                        }
                    }

                    index++;
                }

                await command.execute(resultArguments, resultOptions);    
            } else {
                throw new Error(
                    `Command "${argv[0]}" was not found`
                );
            }
        } else {
            await this.commands['help'].execute({}, {});
        }
    }
}
