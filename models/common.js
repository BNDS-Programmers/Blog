class Model {
    constructor(reocrd){
        this.record = record;
        // this.model = null; // this should be overridden by subclasses
    }
    load_data(){
        this.data = JSON.parse(JSON.stringify(record.get({ plain: true })));
    }
    async copy(record){
        record = await record;
        if(!record) return null;
        return this(await record);
    }
    async from_id(id){
        return this.copy(this.model.findById(id));
    }
    async find_one(where){
        return this.copy(this.model.findOne(where));
    }
    async query(where){
        return (await this.model.findAll(where).mapAsync(x => this.copy(x)));
    }
    async all(){
        return (await this.model.all());
    }
    put(k, v){
        if(this.model.tableAttributes[k])
            this.data[k] = v;
    }
    async save(){
        for(let k in this.data){
            if(this.model.tableAttributes[k].json){
                this.record.set(k, this.data[k]);
            }
        }
        if(this.record.isNewRecord){
            await this.record.save();
            await this.record.reload();
            this.load_data();
        }else{
            await this.record.save();
            return;
        }
    }
}

module.exports = Model;