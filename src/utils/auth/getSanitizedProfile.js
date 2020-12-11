function getSanitizedProfile(userObj) {
  const {
    __v,
    _id,
    email,
    password,
    createdAt,
    updatedAt,
    token,
    refreshToken,
    location,
    ...sanitizedProfile
  } = userObj;

  return sanitizedProfile;
}

module.exports = getSanitizedProfile;