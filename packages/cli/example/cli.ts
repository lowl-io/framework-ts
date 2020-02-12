import { ConsoleApplication } from "../src";
import { Arguments, Options, CommandInterface } from "../src/AbstractCommand";

type MyCommandArguments = {
    url: string,
};

type MyCommandOptions = {
    limit?: number;
    def?: number;
};

class MyCommand implements CommandInterface<MyCommandArguments, MyCommandOptions> {
    public readonly name: string = 'my:command';
    public readonly description: string = 'My Awesome Command';
    public readonly arguments: Arguments = {
        'url': {
            type: 'string',
            required: true,
        }
    };
    public readonly options: Options = {
        'limit': {
            type: 'number',
        },
        'def': {
            type: 'number',
            default: 5,
        }
    };

    public async execute(args: MyCommandArguments, opts: MyCommandOptions): Promise<void> {
        console.log('url', args.url);
        console.log('limit', opts.limit);
        console.log('def', opts.def);
    }
}

const application = new ConsoleApplication();
application.addCommand(new MyCommand());
application.execute();
