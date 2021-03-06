import React from 'react';

import { Dropdown, Search } from '@kyma-project/react-components';

const SearchDropdown = ({ onChange }) => {
  return (
    <Dropdown name="Search" firstButton>
      <Search placeholder="Search" onChange={onChange} />
    </Dropdown>
  );
};

export default SearchDropdown;
