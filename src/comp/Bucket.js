import React from 'react';
import { WidgetContainer, HeaderBar } from './theme/ThemeComp';

export default ({ data, update }) => {
  return (
    <WidgetContainer>
      <HeaderBar>
        <h2>{ bucket.name } Bucket</h2>
      </HeaderBar>
    </WidgetContainer>
  )
}