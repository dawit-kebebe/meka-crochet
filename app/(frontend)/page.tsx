import NewProducts from './components/NewProducts';
import Slider from './components/Slider';
import TaggedProducts from './components/TaggedProducts';


export default function Home() {

  return (
    <>
      <Slider />
      <NewProducts />
      <TaggedProducts />
    </>
  );
}
