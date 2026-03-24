import React from 'react'
import { EmptyState } from './UI'
import { ListingCard } from './ListingCard'


function SavedComponent({savedListings,handleSaveToggle,compact,className}) {
  return (
<div className="px-4 pt-4">
  {savedListings.length === 0 ? (
    <EmptyState
      icon="♡"
      title="No saved items yet"
      sub="Save listings you love to view them here"
    />
  ) : (
    <div  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {savedListings.map((l) => (
        <ListingCard
          key={l.id}
          listing={l}
          onOffer={() => {}}
          compact={compact} // or remove compact entirely and style via CSS
          isSaved={true}
          onSaveToggle={handleSaveToggle}
        />
      ))}
    </div>
  )}
</div>
  )
}

export default SavedComponent