jest.mock('../../repositories/lostfoundRepository');
jest.mock('../../services/mediaService');

const lostfoundRepository = require('../../repositories/lostfoundRepository');
const lostfoundService = require('../../services/lostfoundService');

describe('lostfoundService.resolveItem', () => {
  test('treats soft-deleted items as not found', async () => {
    const item = { user: { toString: () => 'u1' }, isDeleted: true, save: jest.fn() };
    lostfoundRepository.findById.mockResolvedValue(item);

    await expect(
      lostfoundService.resolveItem({ itemId: 'i1', userId: 'u1', isAdmin: false })
    ).rejects.toMatchObject({ status: 404 });
    expect(item.save).not.toHaveBeenCalled();
  });

  test('marks an active item as resolved for its owner', async () => {
    const item = { user: { toString: () => 'u1' }, isDeleted: false, save: jest.fn() };
    lostfoundRepository.findById.mockResolvedValue(item);

    await lostfoundService.resolveItem({ itemId: 'i1', userId: 'u1', isAdmin: false });
    expect(item.resolved).toBe(true);
    expect(item.save).toHaveBeenCalled();
  });
});
