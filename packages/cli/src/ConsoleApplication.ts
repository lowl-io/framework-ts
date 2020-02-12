import { CommandInterface, ArgumentSchema, OptionSchema, SupportedType } from './AbstractCommand';
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

    protected convertValue(value: any, type: SupportedType)
    {
        switch (type.toLowerCase()) {
            case 'integer':
                return parseInt(value);
            case 'number':
                return Number(value);
            case 'string':
                return String(value);
            default:
                throw new Error(`Unsupported type: "${type}"`);
        }
    }

    protected formatArgumentValue(value: any, schema: ArgumentSchema)
    {
        if (schema.type) {
            return this.convertValue(value, schema.type);
        }

        return value;
    }

    protected formatOptionValue(value: any, schema: OptionSchema)
    {
        if (schema.type) {
            return this.convertValue(value, schema.type);
        }

        return value;
    }

    public async execute(): Promise<void> {
        const argv = process.argv.slice(2);

        if (argv[0]) {
            if (argv[0] in this.commands) {
                const command: CommandInterface<unknown, unknown> = this.commands[argv[0]];
                const argvs = argv.splice(1);

                let resultArguments:Record<string, any> = {};
                let resultOptions: Record<string, any> = {};

                let index = 0;
                let slice = 0;

                for (const [argumentName, argumentSchema] of Object.entries(command.arguments)) {
                    if (index in argvs) {
                        slice++;

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

                const options = argvs.slice(slice);

                for (const option of options) {
                    if (option.startsWith('--')) {
                        let parts = option.substr(2).split('=');
                        if (parts.length == 2) {
                            const [ arg, arv ] = parts;

                            if (command.options[arg]) {
                                resultOptions[arg] = this.formatOptionValue(
                                    arv,
                                    command.options[arg]
                                );
                            }
                        }
                    }
                }

                console.log(resultOptions);

                for (const [optionName, optionSchema] of Object.entries(command.options)) {
                    if (!(optionName in resultOptions) && optionSchema.default !== undefined) {
                        resultOptions[optionName] = optionSchema.default;
                    }
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
