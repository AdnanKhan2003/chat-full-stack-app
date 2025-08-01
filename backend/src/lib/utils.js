import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('jwt', token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    });

    return token;
}

export const capitalizeFirstLetter = (string) => {
    if(typeof string !== 'string') return false;
    return string[0].toUpperCase() + string.slice(1).toLowerCase(); 
};

