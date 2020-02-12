
export type ArgumentSchema = {
    type: 'string'|'number',
    required: boolean,
};
export type Arguments = {[key: string]: ArgumentSchema};

export type OptionSchema = {
    type: 'string'|'number',
    default?: any;
};
export type Options = {[key: string]: OptionSchema};

export interface CommandInterface<A = {}, O = {}> {
    readonly name: string;
    readonly description: string;
    readonly arguments: Arguments;
    readonly options: Options;

    execute(args: A, opts: O): Promise<void>;
}
