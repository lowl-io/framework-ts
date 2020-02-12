import { Arguments, Options, CommandInterface } from './AbstractCommand';

export class HelpCommand implements CommandInterface<{}, {}> {
    public readonly name: string = 'help';
    public readonly description: string = 'Command that show help for the command';
    public readonly arguments: Arguments = {};
    public readonly options: Options = {};

    public constructor(
        protected readonly commands: Record<string, CommandInterface>
    ) {}

    public async execute(): Promise<void> {
        for (const [name, command] of Object.entries(this.commands)) {
            console.log(name + ' ' + command.description);
        }
    }
}
