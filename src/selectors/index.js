export function formattedUsername(profiles) {
  return profiles.map(profile => {
    return {
      value: profile.id,
      text: profile.firstName + ' ' + profile.lastName
    };
  });
}

export const isEmpty = value => value === 'undefined' || value === 'null' || value == '';
