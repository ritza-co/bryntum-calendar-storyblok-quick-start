import { Page as PageType } from '@/.storyblok/types/storyblok-components';
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react';

const Page = ({ blok }: { blok: PageType & SbBlokData }) => {
    return (
        <main {...storyblokEditable(blok)}>
            {blok.body?.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
        </main>
    );
};

export default Page;