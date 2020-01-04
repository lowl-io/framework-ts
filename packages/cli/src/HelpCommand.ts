import { AbstractCommand, Arguments, Options } from './AbstractCommand';
import { CommandsMap } from './ConsoleApplication';

export class HelpCommand implements AbstractCommand<{}, {}> {
    public readonly name: string = 'help';
    public readonly description: string = 'Command that show help for the command';
    public readonly arguments: Arguments = {};
    public readonly options: Options = {};

    protected readonly commands: CommandsMap;

    public constructor(commands: CommandsMap)
    {
        this.commands = commands;
    }

    public async execute(): Promise<void> {
        for (const [name, command] of Object.entries(this.commands)) {
            console.log(name + ' ' + command.description);
        }
    }
}
