const slugify = require('slugify');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        default: 'asd'
    }
});

CategorySchema.pre('validate', function(next) {
    this.slug = slugify(this.name, {
        lower: true,
        strict: true
    });
    next();
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;