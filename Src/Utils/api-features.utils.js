
export class ApiFeatures{
    //mongooseQuery=> model
    //query=> req.query
    constructor(mongooseQuery, query,select) {
        this.mongooseQuery = mongooseQuery
        this.query = query
        this.select = select
        this.options = {}
    }
    
    filter_sort_pagination() {
        const { page = 1, limit = 3, sort, ...filters } = this.query;
        //selecting
        if (this.select) {
            this.options.select={select:this.select}
        }
        //sort
        if (sort) {
            const sortObj = Object.entries(sort).reduce((acc, [key, value]) => {
                acc[key] = parseInt(value); // convert to number
          return acc;
            }, {});
            
            this.options.sort = sortObj;
        }
        //filter
        const stringfilters = JSON.stringify(filters);
        const replacefilters = stringfilters.replaceAll(
            /gt|gte|lt|lte/g,
            (ele) => `$${ele}`
        );
        const parsefilters = JSON.parse(replacefilters);
        //pagination
        const skip = (page - 1) * limit;
        this.options.page = page
        this.options.limit = limit
        this.options.skip = skip
        
        this.mongooseQuery = this.mongooseQuery.paginate(
            parsefilters,
            this.options
        );
        return this
    }
}
    //sort
    // sort() {
    //   const { sort } = this.query;
    //     // بحول الاوبجيكت لاراي الاول علشان اعرف الوب عليه لو في اكثر من حاجه بعد كدا بقسمة بالرديوث لكي وفاليو
    //     const sortObj = Object.entries(sort).reduce((acc, [key, value]) => {
    //       acc[key] = parseInt(value); // convert to number
    //       return acc;
    //     }, {}); //هنا انا عاوز اعمل قيمة مبدأية يخزن فيها وهى obj فاضي
    //     this.options.sort = sortObj;
    //     console.log(this.options);
    
    //    this.mongooseQuery = this.mongooseQuery.paginate(
    //      this.filtersObj,
    //      this.options
    //    );
    //   return this;
    // }
    
    //pagination
    // pagination() {
    //     const { page = 1, limit = 3 } = this.query
    //     const skiping = (page - 1) * limit;
    //     this.options = { page, limit, skip: skiping ,sort:{price:-1,amount}}

    //     this.mongooseQuery = this.mongooseQuery.paginate(this.filtersObj, this.options);
    //     return this
    // }

    //filter