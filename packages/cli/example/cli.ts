import { ConsoleApplication } from "../src";
import { AbstractCommand, Arguments, Options } from "../src/AbstractCommand";

type MyCommandArguments = {
    url: string,
};

type MyCommandOptions = {};

class MyCommand implements AbstractCommand<MyCommandArguments, MyCommandOptions> {
    public readonly name: string = 'my:command';
    public readonly description: string = 'My Awesome Command';
    public readonly arguments: Arguments = {
        'url': {
            type: 'string',
            required: true,
        }
    };
    public readonly options: Options = {};

    public async execute(args: MyCommandArguments, opts: MyCommandOptions): Promise<void> {
        console.log('test', args.url);
    }
}

const application = new ConsoleApplication();
application.addCommand(new MyCommand());
application.execute();
