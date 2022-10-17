const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createUser = async (req, res) => {
    try 
    {
        const user = await User.create(req.body);
        res.status(201).redirect('/login');
    } 
    catch(error) 
    {
        const errors = validationResult(req);
        for (let i = 0; i < errors.array().length; i++) {
            req.flash('validate', errors.array()[i].msg);
        }
        res.status(201).redirect('/register');
    }
};

exports.loginUser = async (req, res) => {
    try 
    {
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if(user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if(same) {
                    req.session.userID = user._id;
                    res.status(302).redirect('/users/dashboard');
                } else {
                    req.flash('error', "Your password is not correct");
                    res.status(400).redirect('/login');
                }
            });
        } else {
            req.flash('error', "User not found");
            res.status(400).redirect('/login');
        }
    } 
    catch(error) 
    {
        res.status(400).json({
            status: 'Error',
            error
        });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.status(302).redirect('/');
    });
};

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID }).populate('courses');
    const categories = await Category.find();
    const courses = await Course.find({ user: req.session.userID }).sort('-createdAt');
    const users = await User.find();
    res.status(200).render('dashboard', { pageName: 'dashboard', user, categories, courses, users });
};

exports.deleteUser = async (req, res) => {
    try
    {
        await User.findByIdAndRemove(req.params.id);
        await Course.deleteMany({ user: req.params.id });
        res.status(302).redirect('/users/dashboard');
    }
    catch (error)
    {
        res.status(400).json({
            status: 'error',
            error
        });
    }
};