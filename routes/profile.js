const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../model/profile');
const { check, validationResult } = require('express-validator/check');

// @route   GET rest/api
// @desc    GET current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'there is no profile' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'server error' });
  }
});

// @route   POST rest/api
// @desc    Create / Update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required')
        .not()
        .isEmpty(),
      check('skills', 'skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body;

    const profileFeilds = {};

    profileFeilds.user = req.user.id;
    if (company) profileFeilds.company = company;
    if (location) profileFeilds.location = location;
    if (website) profileFeilds.website = website;
    if (bio) profileFeilds.bio = bio;
    if (status) profileFeilds.status = status;
    if (githubusername) profileFeilds.githubusername = githubusername;

    if (skills)
      profileFeilds.skills = skills.split(',').map(skill => skill.trim());

    profileFeilds.socail = {};
    if (youtube) profileFeilds.socail.youtube = youtube;
    if (twitter) profileFeilds.socail.twitter = twitter;
    if (instagram) profileFeilds.socail.instagram = instagram;
    if (linkedin) profileFeilds.socail.linkedin = linkedin;
    if (facebook) profileFeilds.socail.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFeilds);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  }
);

// @route   GET rest/profile
// @desc    GET user profiles
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// @route   GET rest/profile/user/:user_id
// @desc    GET profile by user ID
// @access  public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'the user id doesnt not exist ' });
    }

    res.json(profile);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'profile not found' });
    }
    res.status(500).send(err);
  }
});

module.exports = router;
