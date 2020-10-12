const passport = require('passport')
var NaverStrategy = require('passport-naver').Strategy;

export function naverLogin() {
    passport.use(new NaverStrategy({
            clientID: config.naver.clientID,
            clientSecret: config.naver.clientSecret,
            callbackURL: config.naver.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'naver.id': profile.id
            }, function(err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.displayName,
                        provider: 'naver',
                        naver: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));
}