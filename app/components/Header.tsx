import { Header as HeaderType } from '@/.storyblok/types/storyblok-components';
import { SbBlokData, storyblokEditable } from '@storyblok/react';

const Header = ({ blok }: { blok: HeaderType & SbBlokData }) => {
    return (
        <h2 {...storyblokEditable(blok)} style={{ padding : '1rem' }}>
            {blok.title}
        </h2>
    );
};

export default Header;