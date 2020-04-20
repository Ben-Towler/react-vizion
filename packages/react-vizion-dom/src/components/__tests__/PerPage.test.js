import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PerPage from '../PerPage';

Enzyme.configure({ adapter: new Adapter() });

describe('PerPage', () => {
  it('renders', () =>
    expect(
      renderer
        .create(
          <PerPage
            refine={() => null}
            currentRefinement={5}
            items={[
              {
                value: 5,
                label: 'show 5 hits',
              },
              {
                value: 10,
                label: 'show 10 hits',
              },
            ]}
          />
        )
        .toJSON()
    ).toMatchSnapshot());

  it('renders with a custom className', () =>
    expect(
      renderer
        .create(
          <PerPage
            className="MyCusomPerPage"
            refine={() => null}
            currentRefinement={5}
            items={[
              {
                value: 5,
                label: 'show 5 hits',
              },
              {
                value: 10,
                label: 'show 10 hits',
              },
            ]}
          />
        )
        .toJSON()
    ).toMatchSnapshot());

  it('refines its value on change', () => {
    const refine = jest.fn();
    const wrapper = mount(
      <PerPage
        createURL={() => '#'}
        items={[
          { value: 2, label: '2 hits per page' },
          { value: 4, label: '4 hits per page' },
          { value: 6, label: '6 hits per page' },
          { value: 8, label: '8 hits per page' },
        ]}
        refine={refine}
        currentRefinement={2}
      />
    );

    const selectedValue = wrapper.find('select');
    expect(selectedValue.find('option')).toHaveLength(4);
    expect(
      selectedValue
        .find('option')
        .first()
        .text()
    ).toBe('2 hits per page');

    selectedValue.find('select').simulate('change', { target: { value: '6' } });

    expect(refine.mock.calls).toHaveLength(1);
    expect(refine.mock.calls[0][0]).toEqual('6');
  });

  it('should use value if no label provided', () => {
    const refine = jest.fn();
    const wrapper = mount(
      <PerPage
        createURL={() => '#'}
        items={[{ value: 2 }, { value: 4 }, { value: 6 }, { value: 8 }]}
        refine={refine}
        currentRefinement={2}
      />
    );

    const selectedValue = wrapper.find('select');
    expect(selectedValue.find('option')).toHaveLength(4);
    expect(
      selectedValue
        .find('option')
        .first()
        .text()
    ).toBe('2');
  });
});
