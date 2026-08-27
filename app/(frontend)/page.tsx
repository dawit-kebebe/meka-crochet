import NewProducts from './components/NewProducts';
import Slider from './components/Slider';
import TaggedProducts from './components/TaggedProducts';


export default function Home() {

  return (
    <>
    <div className='w-full p-4 pt-0'>
      <Slider />
      <NewProducts />
      <TaggedProducts />
    </div>
    </>
  );
}
