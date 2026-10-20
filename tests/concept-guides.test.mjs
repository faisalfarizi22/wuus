import test from 'node:test';
import assert from 'node:assert/strict';
import {conceptGuides} from '../components/concepts/concept-guides.ts';
import {menu} from '../lib/dapur-saji.ts';
import {laundryServices} from '../lib/bersih-laundry.ts';
import {furniture} from '../lib/ruang-kayu.ts';
import {studioExamples} from '../lib/studio-examples.ts';

test('all eight need guides continue into a choice the actual catalog can accept', () => {
  const accepted = {
    'dapur-saji': new Set(menu.map(item => item.category)),
    'bersih-laundry': new Set(laundryServices.map(item => item.id)),
    'ruang-kayu': new Set(furniture.map(item => item.id)),
    ...Object.fromEntries(studioExamples.map(example => [example.slug,
      new Set(example.items.map(item => ['kelopak','sela-wear'].includes(example.slug) ? item.category : item.id))])),
  };
  assert.deepEqual(Object.keys(conceptGuides).sort(), Object.keys(accepted).sort());
  for (const [slug, guide] of Object.entries(conceptGuides)) {
    assert.equal(new Set(guide.choices.map(choice => choice.id)).size, guide.choices.length, slug);
    for (const choice of guide.choices) {
      assert.ok(accepted[slug].has(choice.id), `${slug} must not lead to unavailable ${choice.id}`);
      assert.ok(choice.details.length >= 2, `${slug} needs decision details`);
    }
  }
});

test('guides do not advertise express for services which reject it', () => {
  const laundry = conceptGuides['bersih-laundry'];
  const bedding = laundry.choices.find(choice => choice.id === 'bed-cover');
  assert.equal(laundryServices.find(service => service.id === bedding.id).express, false);
  assert.ok(bedding.details.some(text => /express tidak tersedia/i.test(text)));
  for (const choice of conceptGuides['ruang-kayu'].choices) {
    const product = furniture.find(item => item.id === choice.id);
    assert.ok(choice.details.some(text => text.includes(`${product.min}–${product.max}`)));
  }
});
