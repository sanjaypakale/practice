import React from 'react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  createScaffolderLayout,
  LayoutTemplate,
} from '@backstage/plugin-scaffolder-react';
import { Grid } from '@material-ui/core';

const TwoColumn: LayoutTemplate = ({ properties, description, title }) => {
  const leftProps = properties.filter(prop => prop.content.props.side === 'left');
  const rightProps = properties.filter(prop => prop.content.props.side === 'right');

  return (
    <>
      <h1>{title}</h1>
      <h2>In two-column layout!</h2>
      <Grid container spacing={3}>
        {/* Left side parameters */}
        <Grid item xs={6}>
          {leftProps.map(prop => (
            <div key={prop.content.key}>{prop.content}</div>
          ))}
        </Grid>

        {/* Right side parameters */}
        <Grid item xs={6}>
          {rightProps.map(prop => (
            <div key={prop.content.key}>{prop.content}</div>
          ))}
        </Grid>
      </Grid>
      <div>{description}</div>
    </>
  );
};

export const TwoColumnLayout = scaffolderPlugin.provide(
  createScaffolderLayout({
    name: 'TwoColumn',
    component: TwoColumn,
  }),
);
