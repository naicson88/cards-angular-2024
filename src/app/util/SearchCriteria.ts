export class SearchCriteria {
    private key!: string;
    private operation!: string;
    private value!: Object;
    private orPredicate!: boolean;
    private values!: Array<string>;

    public criterios(key: string, operation: string, value: Object){
        this.key = key;
        this.operation = operation;
        this.value = value;

    }
    
}