import KModal from 'kolibri-design-system/lib/KModal';
import { mount } from '@vue/test-utils';
import { ContentSessionLogResource } from 'kolibri.resources';
import MarkAsFinishedModal from '../../src/views/MarkAsFinishedModal';

describe('Mark as finished modal', () => {
  let wrapper;
  let markSpy;
  let resourceSpy;
  let testSessionId = 'test';

  beforeAll(() => {
    // Mock $store.dispatch to return a Promise
    markSpy = jest.spyOn(MarkAsFinishedModal.methods, 'markResourceAsCompleted');
    resourceSpy = jest.spyOn(ContentSessionLogResource, 'saveModel');
    resourceSpy.mockImplementation(() => Promise.resolve());

    wrapper = mount(MarkAsFinishedModal, {
      propsData: {
        contentSessionLogId: testSessionId,
      },
    });
  });

  describe('When the user cancels the modal', () => {
    // This describe() should go before subsequent ones
    // to avoid needing to resourceSpy.mockReset()
    it('emits a cancel event', () => {
      wrapper.findComponent(KModal).vm.$emit('cancel');
      expect(resourceSpy).not.toHaveBeenCalled();
      expect(wrapper.emitted().cancel).toBeTruthy();
    });
  });

  describe('When the user confirms the modal', () => {
    beforeEach(() => {
      wrapper.findComponent(KModal).vm.$emit('submit');
    });
    it('will make a call to markResourceAsCompleted', () => {
      expect(markSpy).toHaveBeenCalled();
    });
    it('emits an event indicating that the resource is marked as finished', () => {
      expect(wrapper.emitted().complete).toBeTruthy();
    });
  });

  describe('markResourceAsCompleted', () => {
    it('makes a PATCH request to /api/logger/contentsessionlog', () => {
      wrapper.findComponent(KModal).vm.$emit('submit');
      expect(resourceSpy).toHaveBeenCalledWith({
        id: testSessionId,
        data: { progress: 1 },
        exists: true,
      });
    });
  });
});
