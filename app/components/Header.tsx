import { storyblokEditable } from '@storyblok/react';
import { HeaderStoryblok } from '../../component-types-sb';

const Header = ({ blok }: { blok: HeaderStoryblok }) => {
    return (
        <h2 {...storyblokEditable(blok)} style={{ padding : '1rem' }}>
            {blok.title}
        </h2>
    );
};

export default Header;