
export type SupportedType = 'string'|'integer'|'number';

export type ArgumentSchema = {
    type?: SupportedType,
    required: boolean,
};
export type Arguments = {[key: string]: ArgumentSchema};

export type OptionSchema = {
    type?: SupportedType,
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
