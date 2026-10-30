jest.mock('../../repositories/eventRepository');
jest.mock('../../repositories/userRepository');
jest.mock('../../services/mediaService');

const eventRepository = require('../../repositories/eventRepository');
const userRepository = require('../../repositories/userRepository');
const mediaService = require('../../services/mediaService');
const eventsService = require('../../services/eventsService');
const profileService = require('../../services/profileService');

const file = { mimetype: 'image/png', size: 10, buffer: Buffer.from('x') };

describe('image replacement keeps the old image when the upload fails', () => {
  test('events', async () => {
    const event = { image: { public_id: 'old', url: 'u' }, save: jest.fn() };
    eventRepository.findById.mockResolvedValue(event);
    mediaService.uploadSingleImage.mockRejectedValue(new Error('upload failed'));

    const data = {
      title: 'Hackathon',
      description: 'Annual hackathon',
      date: '2026-11-20',
      location: 'Main hall',
      status: 'Upcoming',
    };
    await expect(eventsService.updateEvent({ eventId: 'e1', data, file })).rejects.toThrow(
      'upload failed'
    );
    expect(mediaService.deleteByPublicId).not.toHaveBeenCalled();
    expect(event.image).toEqual({ public_id: 'old', url: 'u' });
  });

  test('profile pictures', async () => {
    const user = { profilePicture: { public_id: 'old', url: 'u' }, save: jest.fn() };
    userRepository.findById.mockResolvedValue(user);
    mediaService.uploadSingleImage.mockRejectedValue(new Error('upload failed'));

    await expect(profileService.updateProfile({ userId: 'u1', data: {}, file })).rejects.toThrow(
      'upload failed'
    );
    expect(mediaService.deleteByPublicId).not.toHaveBeenCalled();
    expect(user.profilePicture).toEqual({ public_id: 'old', url: 'u' });
  });

  test('profile pictures: old image is deleted only after a successful upload', async () => {
    const user = { profilePicture: { public_id: 'old', url: 'u' }, save: jest.fn() };
    userRepository.findById.mockReturnValueOnce(Promise.resolve(user)).mockReturnValueOnce({
      select: () => ({ toObject: () => ({ email: 'a@b.c' }), email: 'a@b.c' }),
    });
    mediaService.uploadSingleImage.mockResolvedValue({ public_id: 'new', url: 'n' });

    await profileService.updateProfile({ userId: 'u1', data: {}, file });

    expect(user.profilePicture).toEqual({ public_id: 'new', url: 'n' });
    expect(mediaService.deleteByPublicId).toHaveBeenCalledWith('old');
  });
});
