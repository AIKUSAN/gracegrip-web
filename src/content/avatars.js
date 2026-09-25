export const AVATARS = [
  'cedar', 'harbor', 'lantern', 'meadow', 'olive', 'river',
  'shelter', 'stone', 'tide', 'willow', 'dawn', 'field',
]

export function avatarPath(id) {
  return AVATARS.includes(id) ? `/avatars/open-peeps/${id}.svg` : '/avatars/open-peeps/cedar.svg'
}
