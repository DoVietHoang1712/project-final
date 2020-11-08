import { Document, DocumentQuery, Model, QueryFindOneAndUpdateOptions } from "mongoose";
import { QueryPostOption } from "../../tools/request.tool";

export class BaseService<T extends Document> {
    /**
     * Construct service base model
     * @param baseModel Mongoose model
     */
    constructor(
        private baseModel: Model<T>,
    ) { }

    /**
     * Count by filter, ignore filter for count all
     * @param conditions condition
     */
    count(conditions?: object): Promise<number> {
        return conditions && conditions !== {}
            ? this.baseModel.countDocuments(conditions).exec()
            : this.baseModel.estimatedDocumentCount().exec();
    }

    /**
     * Find documents by conditions and options
     * @param query QueryPostOption
     */
    getMany(
        query?: QueryPostOption,
    ): DocumentQuery<T[], T, {}> {
        return query
            ? this.baseModel
                .find(query.conditions)
                .setOptions(query.options)
            : this.baseModel
                .find();
    }

    /**
     * Find pagination
     * @param query QueryPostOption
     */
    async getPagination(
        query: QueryPostOption,
    ): Promise<{ data: T[], total: number }> {
        const res = await Promise.all([
            this.getMany(query),
            this.count(query.conditions),
        ]);
        return {
            data: res[0],
            total: res[1],
        };
    }

    /**
     * Find single document by conditions and options
     * @param query QueryPostOption
     */
    getOne(query?: QueryPostOption): DocumentQuery<T, T, {}> {
        const result = this.baseModel
            .findOne(query.conditions);
        if (query) {
            result.setOptions(query.options);
        }
        return result;
    }
    /**
     * Find single document by it's id
     * @param id Document's id
     * @param query QueryPostOption
     */
    getById(id: string, query?: QueryPostOption): DocumentQuery<T, T, {}> {
        const conditions = { _id: id, ...(query && query.conditions) };
        const result = this.baseModel.findOne(conditions);
        if (query) {
            result.setOptions(query.options);
        }
        return result;
    }

    /**
     * Create a document of type CreateDTO
     * @param docs CreateDTO
     */
    create(docs: any): Promise<T> {
        return this.baseModel.create(docs);
    }

    /**
     * Update a document by it's id
     * @param id Document's id
     * @param update Update document
     * @param upsert Upsert option
     */
    updateById(id: string, update: any, options?: QueryFindOneAndUpdateOptions): DocumentQuery<T, T, {}> {
        return this.baseModel
            .findByIdAndUpdate(id, update, options);
    }

    /**
     *
     * @param conditions Find condition
     * @param update Update document
     * @param options Query option
     */
    findOneAndUpdate(conditions: any, update: any, options?: QueryFindOneAndUpdateOptions): DocumentQuery<T, T, {}> {
        return this.baseModel
            .findOneAndUpdate(conditions, update, options);
    }

    /**
     * Delete a document by it's id
     * @param id Document's id
     */
    deleteById(id: string): DocumentQuery<T, T, {}> {
        return this.baseModel
            .findByIdAndDelete(id);
    }

    /**
     *
     * @param conditions Find condition
     */
    findOneAndDelete(conditions: any): DocumentQuery<T, T, {}> {
        return this.baseModel
            .findOneAndDelete(conditions);
    }

}
